"use client";
import { useEffect, useRef } from "react";
import { sdk } from "@farcaster/miniapp-sdk";

const wait = (ms: number) => new Promise(r => setTimeout(r, ms));

export default function SessionBootstrap() {
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    (async () => {
      try {
        console.log("🔐 SB: init… inIframe=", window.self !== window.top);

        // 1) Make sure Warpcast bridge is ready (with timeout fallback)
        let readyOk = false;
        try {
          const ready = sdk.actions.ready();
          const timeout = wait(1500).then(() => { throw new Error("ready timeout"); });
          await Promise.race([ready, timeout]);
          readyOk = true;
          console.log("✅ SB: ready() completed successfully");
        } catch (e) {
          console.warn("⚠️ SB: ready() fallback path", e);
        }

        // 2) Get context (FID)
        let ctx: any = null;
        try {
          ctx = await sdk.context.getCurrentContext();
          console.log("🔑 SB: getCurrentContext success:", ctx);
        } catch (e) {
          console.warn("⚠️ SB: getCurrentContext errored, retry once", e);
          await wait(200);
          ctx = await sdk.context.getCurrentContext().catch(() => null);
          console.log("🔑 SB: getCurrentContext retry result:", ctx);
        }

        const fid = ctx?.user?.fid ?? null;
        console.log("🔑 SB: context fid=", fid, ctx);

        if (!fid) {
          console.warn("❌ SB: No FID in context; mobile may be throttling. Will not establish.");
          return;
        }

        // 3) POST establish with an explicit JSON body & headers
        const payload = {
          fid,
          username: ctx?.user?.username ?? null,
          client: ctx?.client ?? null,
          ts: Date.now(),
          ua: navigator.userAgent,
        };

        const doPost = async () => {
          console.log("🔐 SB: POSTing establish with payload:", payload);
          return fetch("/api/auth/establish", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Accept": "application/json",
            },
            credentials: "include",        // allow cookie session if you set one
            keepalive: true,               // helps on iOS when navigating
            body: JSON.stringify(payload), // <- BODY (explicit!)
          });
        };

        let res = await doPost();
        console.log("🔐 SB: First establish attempt:", res.status);
        
        if (!res.ok) {
          // iOS WebView can drop the first fetch while painting — retry with short backoff
          console.warn("⚠️ SB: establish not ok", res.status);
          await wait(250);
          res = await doPost();
          console.log("🔐 SB: Second establish attempt:", res.status);
        }

        if (!res.ok) {
          const err = await res.text().catch(() => "");
          console.error("❌ SB: establish failed", res.status, err);
          return;
        }

        const responseData = await res.json();
        console.log("✅ SB: session established successfully:", responseData);
        
        // Set a flag in memory so other hooks know session is ready
        (window as any).__sessionReady = true;
        
        // Dispatch event for legacy listeners
        window.dispatchEvent(new Event("fc:session-ready"));
        console.log("📡 SB: Dispatched fc:session-ready event");
        
      } catch (e) {
        console.error("❌ SB fatal:", e);
      }
    })();
  }, []);

  return null;
}
