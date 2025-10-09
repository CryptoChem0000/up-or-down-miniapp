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
        
        // Initialize Farcaster SDK if in iframe
        if (typeof window !== "undefined" && window !== window.parent) {
          console.log("📱 SessionProvider: In iframe, initializing SDK...");
          
          if (isIOSWebView) {
            console.log("🍎 SessionProvider: iOS WebView detected - using simplified initialization");
            // For iOS WebView, try a simpler approach
            try {
              // Import SDK dynamically
              console.log("📦 SessionProvider: Importing Farcaster SDK for iOS...");
              const { sdk } = await import("@farcaster/miniapp-sdk");
              console.log("📦 SessionProvider: SDK imported successfully for iOS:", !!sdk);
              
              // Try ready() with a shorter timeout for iOS
              console.log("📱 SessionProvider: Calling sdk.actions.ready() for iOS...");
              const readyPromise = sdk.actions.ready();
              const timeoutPromise = new Promise((_, reject) => 
                setTimeout(() => reject(new Error("iOS SDK ready() timeout")), 3000)
              );
              
              await Promise.race([readyPromise, timeoutPromise]);
              console.log("✅ SessionProvider: iOS SDK ready() successful");
            } catch (iosError) {
              console.error("❌ SessionProvider: iOS SDK failed:", iosError);
              console.log("🔄 SessionProvider: Skipping SDK for iOS WebView compatibility");
            }
          } else {
            // Standard initialization for non-iOS
            console.log("📦 SessionProvider: Importing Farcaster SDK...");
            const { sdk } = await import("@farcaster/miniapp-sdk");
            console.log("📦 SessionProvider: SDK imported successfully:", !!sdk);
            
            // Wait for DOM to be ready before calling ready()
            console.log("⏳ SessionProvider: Waiting for DOM ready...");
            await new Promise(resolve => setTimeout(resolve, 200));
            
            console.log("📱 SessionProvider: Calling sdk.actions.ready()...");
            try {
              // Add timeout for iOS WebView compatibility
              const readyPromise = sdk.actions.ready();
              const timeoutPromise = new Promise((_, reject) => 
                setTimeout(() => reject(new Error("SDK ready() timeout")), 5000)
              );
              
              await Promise.race([readyPromise, timeoutPromise]);
              console.log("✅ SessionProvider: SDK ready() called successfully");
            } catch (readyError) {
              console.error("❌ SessionProvider: SDK ready() failed:", readyError);
              console.log("🔄 SessionProvider: Continuing without SDK ready() - fallback");
            }
          }
          
          // Get user context (only if SDK was successfully imported)
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

