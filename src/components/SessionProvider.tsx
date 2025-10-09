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
        
        // Check if we're in iOS WebView (Farcaster iOS app)
        const isIOSWebView = typeof window !== "undefined" && 
          window.navigator.userAgent.includes("iPhone") && 
          window !== window.parent;
        console.log("🍎 SessionProvider: iOS WebView detected:", isIOSWebView);
        
        // Initialize Farcaster SDK if in iframe (without calling ready() - handled by FarcasterReadyBridge)
        if (typeof window !== "undefined" && window !== window.parent) {
          console.log("📱 SessionProvider: In iframe, getting user context...");
          
          // Get user context (ready() is handled by FarcasterReadyBridge)
          try {
            const { sdk } = await import("@farcaster/miniapp-sdk");
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
        // Set ready anyway to not block the app - especially important for iOS WebView
        if (!cancelled) {
          console.log("🔄 SessionProvider: Setting sessionReady=true despite error for iOS WebView compatibility");
          setSessionReady(true);
        }
      }
      
      // Fallback timeout - ensure sessionReady is set within 10 seconds
      setTimeout(() => {
        if (!cancelled) {
          console.log("⏰ SessionProvider: Fallback timeout - forcing sessionReady=true");
          setSessionReady(true);
        }
      }, 10000);
    })();

    return () => { cancelled = true; };
  }, []);

  const value = useMemo(() => ({ sessionReady, fid, username }), [sessionReady, fid, username]);
  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

