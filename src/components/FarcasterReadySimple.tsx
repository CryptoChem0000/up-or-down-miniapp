"use client";

import { useEffect } from "react";

export default function FarcasterReadySimple() {
  useEffect(() => {
    const initializeSDK = async () => {
      try {
        console.log("🔍 Initializing Farcaster Mini App SDK...");
        
        // Check if we're in a Mini App environment
        const inMiniApp = typeof window !== "undefined" && window.parent !== window;
        console.log("Mini App environment detected:", inMiniApp);
        
        if (inMiniApp) {
          console.log("✅ Running in Farcaster Mini App environment");
          
          // Import SDK - try both methods
          let sdk;
          try {
            const { sdk: miniappSdk } = await import("@farcaster/miniapp-sdk");
            sdk = miniappSdk;
            console.log("📦 Using @farcaster/miniapp-sdk");
          } catch (e1) {
            try {
              const frameSdk = await import("@farcaster/frame-sdk");
              sdk = frameSdk.default || frameSdk;
              console.log("📦 Using @farcaster/frame-sdk");
            } catch (e2) {
              throw new Error(`Both SDK imports failed: ${e1 instanceof Error ? e1.message : String(e1)}, ${e2 instanceof Error ? e2.message : String(e2)}`);
            }
          }
          console.log("📦 SDK imported successfully");
          
          // Call ready() immediately - according to official docs
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

    // Call immediately
    initializeSDK();
    
    // Also try on window load as backup
    const handleLoad = async () => {
      try {
        let sdk;
        try {
          const { sdk: miniappSdk } = await import("@farcaster/miniapp-sdk");
          sdk = miniappSdk;
        } catch (e1) {
          const frameSdk = await import("@farcaster/frame-sdk");
          sdk = frameSdk.default || frameSdk;
        }
        await sdk.actions.ready();
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
