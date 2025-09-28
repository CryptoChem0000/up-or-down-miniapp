"use client";

import { useEffect } from "react";

export default function FarcasterReady() {
  useEffect(() => {
    // Immediate ready() call - don't wait for anything
    const callReadyImmediately = async () => {
      try {
        console.log("🚀 Calling ready() immediately...");
        const sdk = await import("@farcaster/miniapp-sdk");
        await sdk.ready();
        console.log("✅ Ready() called successfully");
      } catch (e) {
        console.log("Immediate ready() failed:", e);
      }
    };

    // Call ready() immediately
    callReadyImmediately();

    // Also try on component mount
    const initializeApp = async () => {
      try {
        console.log("🔍 Initializing Farcaster Mini App...");
        
        // Check if we're in a Mini App environment
        const inMiniApp = typeof window !== "undefined" && window.parent !== window;
        console.log("Mini App environment detected:", inMiniApp);
        
        if (inMiniApp) {
          console.log("✅ Running in Farcaster Mini App environment");
          
          try {
            const sdk = await import("@farcaster/miniapp-sdk");
            console.log("📦 SDK imported successfully");
            
            // Call ready() again
            console.log("🚀 Calling sdk.ready()...");
            await sdk.ready();
            console.log("✅ SDK ready() called successfully");
            
            // Get context
            try {
              const context = await sdk.context;
              console.log("📱 SDK Context:", context);
            } catch (contextError) {
              console.log("Context not available:", contextError);
            }
            
          } catch (sdkError) {
            console.error("❌ SDK failed:", sdkError);
            
            // PostMessage fallback
            try {
              if (window.parent && window.parent !== window) {
                window.parent.postMessage({ 
                  type: "ready",
                  source: "farcaster-miniapp"
                }, "*");
                console.log("✅ PostMessage fallback sent");
              }
            } catch (postError) {
              console.error("❌ PostMessage failed:", postError);
            }
          }
        } else {
          console.log("🌐 Not in Mini App environment");
        }
      } catch (error) {
        console.error("❌ Failed to initialize:", error);
      }
    };

    // Call after a short delay
    setTimeout(initializeApp, 100);
    
    // Also try on window load
    const handleLoad = async () => {
      try {
        const sdk = await import("@farcaster/miniapp-sdk");
        await sdk.ready();
        console.log("✅ Ready() called on window load");
      } catch (e) {
        console.log("Window load ready() not needed:", e);
      }
    };
    
    window.addEventListener('load', handleLoad);
    
    return () => {
      window.removeEventListener('load', handleLoad);
    };
  }, []);

  return null;
}
