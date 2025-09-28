"use client";

import { useEffect } from "react";

export default function FarcasterReady() {
  useEffect(() => {
    const initializeApp = async () => {
      try {
        console.log("🔍 Initializing Farcaster Mini App...");
        
        // Check if we're in a Mini App environment using iframe detection
        const inMiniApp = typeof window !== "undefined" && window.parent !== window;
        console.log("Mini App environment detected:", inMiniApp);
        
        if (inMiniApp) {
          console.log("✅ Running in Farcaster Mini App environment");
          
          // Try to import and use the SDK dynamically
          try {
            const { sdk } = await import("@farcaster/miniapp-sdk");
            console.log("📦 SDK imported successfully");
            
            // Call ready() IMMEDIATELY to hide splash screen - this is critical!
            console.log("🚀 Calling sdk.actions.ready()...");
            await sdk.actions.ready();
            console.log("✅ SDK ready() called successfully - splash screen should hide");
            
            // Get context information after ready()
            try {
              const context = await sdk.context;
              console.log("📱 SDK Context:", {
                user: context.user,
                client: context.client,
                location: context.location,
                features: context.features
              });
            } catch (contextError) {
              console.log("Context not available:", contextError);
            }
            
          } catch (sdkError) {
            console.error("❌ SDK import/usage failed:", sdkError);
            
            // Fallback: try postMessage approach
            try {
              console.log("🔄 Attempting postMessage fallback...");
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
          
        } else {
          console.log("🌐 Not in Mini App environment, running in browser");
        }
      } catch (error) {
        console.error("❌ Failed to initialize Farcaster Mini App:", error);
      }
    };

    // Call immediately when component mounts
    initializeApp();
  }, []);

  return null;
}
