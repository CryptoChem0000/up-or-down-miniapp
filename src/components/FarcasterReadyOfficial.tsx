"use client";

import { useEffect } from "react";

export default function FarcasterReadyOfficial() {
  useEffect(() => {
    const initializeSDK = async () => {
      try {
        console.log("🔍 Initializing Farcaster Mini App SDK...");
        
        // Check if we're in a Mini App environment
        const inMiniApp = typeof window !== "undefined" && window.parent !== window;
        console.log("Mini App environment detected:", inMiniApp);
        
        if (inMiniApp) {
          console.log("✅ Running in Farcaster Mini App environment");
          
          // Import SDK according to official docs
          const { sdk } = await import("@farcaster/miniapp-sdk");
          console.log("📦 SDK imported successfully");
          
          // Call ready() according to official documentation
          // https://miniapps.farcaster.xyz/docs/guides/loading
          console.log("🚀 Calling sdk.actions.ready()...");
          await sdk.actions.ready();
          console.log("✅ ready() called successfully - splash screen should hide");
          
          // Get context for debugging
          try {
            const context = await sdk.context;
            console.log("📱 SDK Context:", context);
          } catch (contextError) {
            console.log("Context not available:", contextError);
          }
          
        } else {
          console.log("🌐 Not in Mini App environment, running in browser");
        }
      } catch (error) {
        console.error("❌ Failed to initialize Farcaster Mini App:", error);
        
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
          console.error("❌ PostMessage fallback failed:", postError);
        }
      }
    };

    // Call immediately when component mounts
    initializeSDK();
    
    // Also try on window load as backup
    const handleLoad = async () => {
      try {
        const { sdk } = await import("@farcaster/miniapp-sdk");
        await sdk.actions.ready();
        console.log("✅ ready() called on window load");
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
