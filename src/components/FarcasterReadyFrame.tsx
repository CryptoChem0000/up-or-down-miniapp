"use client";

import { useEffect } from "react";

export default function FarcasterReadyFrame() {
  useEffect(() => {
    const initializeSDK = async () => {
      try {
        console.log("🔍 Initializing Farcaster Mini App with Frame SDK...");
        
        // Check if we're in a Mini App environment
        const inMiniApp = typeof window !== "undefined" && window.parent !== window;
        console.log("Mini App environment detected:", inMiniApp);
        
        if (inMiniApp) {
          console.log("✅ Running in Farcaster Mini App environment");
          
          // Try Frame SDK constructor approach
          try {
            const { Frame } = await import("@farcaster/frame-sdk");
            console.log("📦 Frame SDK imported successfully");
            
            const sdk = new Frame();
            console.log("📦 Frame SDK instance created");
            
            // Call ready() immediately
            console.log("🚀 Calling sdk.ready()...");
            await sdk.ready();
            console.log("✅ ready() called successfully - splash screen should hide");
            
          } catch (frameError) {
            console.error("❌ Frame SDK failed:", frameError);
            
            // Fallback to miniapp-sdk
            try {
              const { sdk } = await import("@farcaster/miniapp-sdk");
              console.log("📦 Fallback to miniapp-sdk");
              
              console.log("🚀 Calling sdk.ready()...");
              await sdk.ready();
              console.log("✅ ready() called successfully - splash screen should hide");
              
            } catch (miniappError) {
              console.error("❌ Both SDK approaches failed:", miniappError);
              
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
          }
          
        } else {
          console.log("🌐 Not in Mini App environment, running in browser");
        }
      } catch (error) {
        console.error("❌ Failed to initialize Farcaster Mini App:", error);
      }
    };

    // Call immediately when component mounts
    initializeSDK();
    
    // Also try on window load as backup
    const handleLoad = async () => {
      try {
        const { Frame } = await import("@farcaster/frame-sdk");
        const sdk = new Frame();
        await sdk.ready();
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
