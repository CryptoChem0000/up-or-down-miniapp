"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { tryEstablishFcSession } from "@/lib/fc-establish";

type SessionCtx = {
  sessionReady: boolean;
  fid?: number | null;
  username?: string | null;
};

const SessionContext = createContext<SessionCtx>({ sessionReady: false });
export const useSession = () => useContext(SessionContext);

export default function SessionProvider({ children }: { children: React.ReactNode }) {
  const [sessionReady, setSessionReady] = useState(false);
  const [fid, setFid] = useState<number | null>(null);
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        console.log("🚀 SessionProvider: Initializing...");
        console.log("🔍 SessionProvider: User Agent:", typeof window !== "undefined" ? window.navigator.userAgent : "server");
        console.log("🔍 SessionProvider: In iframe:", typeof window !== "undefined" && window !== window.parent);
        console.log("🔍 SessionProvider: Window parent:", typeof window !== "undefined" ? window.parent : "undefined");
        
        // Initialize Farcaster SDK if in iframe
        if (typeof window !== "undefined" && window !== window.parent) {
          console.log("📱 SessionProvider: In iframe, initializing SDK...");
          
          // Import SDK dynamically
          console.log("📦 SessionProvider: Importing Farcaster SDK...");
          const { sdk } = await import("@farcaster/miniapp-sdk");
          console.log("📦 SessionProvider: SDK imported successfully:", !!sdk);
          
          // Wait for DOM to be ready before calling ready()
          console.log("⏳ SessionProvider: Waiting for DOM ready...");
          await new Promise(resolve => setTimeout(resolve, 100));
          
          console.log("📱 SessionProvider: Calling sdk.actions.ready()...");
          try {
            await sdk.actions.ready();
            console.log("✅ SessionProvider: SDK ready() called successfully");
          } catch (readyError) {
            console.error("❌ SessionProvider: SDK ready() failed:", readyError);
            throw readyError;
          }
          
          // Get user context
          try {
            const context = await sdk.context;
            console.log("📋 SessionProvider: User context:", context);
            
            if (context && context.user && context.user.fid) {
              // Establish session with the FID
              console.log("🔑 SessionProvider: Establishing session with FID:", context.user.fid);
              const response = await fetch("/api/auth/establish", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({ fid: context.user.fid.toString() }),
              });
              
              if (response.ok) {
                console.log("✅ SessionProvider: Session established successfully");
                if (!cancelled) {
                  setFid(context.user.fid);
                  setUsername(context.user.username || null);
                }
              } else {
                console.error("❌ SessionProvider: Failed to establish session:", response.status);
              }
            }
          } catch (contextError) {
            console.error("❌ SessionProvider: Error getting user context:", contextError);
          }
        } else {
          // Not in iframe, just establish basic session
          console.log("ℹ️ SessionProvider: Not in iframe, attempting basic session...");
          await tryEstablishFcSession();
        }
        
        if (!cancelled) {
          setSessionReady(true);
          // Dispatch event for legacy listeners
          if (typeof window !== "undefined") {
            window.dispatchEvent(new Event("fc:session-ready"));
            console.log("📡 SessionProvider: Dispatched fc:session-ready event");
          }
        }
      } catch (error) {
        console.error("❌ SessionProvider: Error:", error);
        // Set ready anyway to not block the app
        if (!cancelled) setSessionReady(true);
      }
    })();

    return () => { cancelled = true; };
  }, []);

  const value = useMemo(() => ({ sessionReady, fid, username }), [sessionReady, fid, username]);
  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

