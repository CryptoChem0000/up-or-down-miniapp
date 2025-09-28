"use client";

import { useEffect } from "react";
import { sdk } from "@farcaster/miniapp-sdk";

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
          
          // Call ready() IMMEDIATELY to hide splash screen - this is critical!
          // According to the official docs: "Call ready when your interface is ready to be displayed"
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
          
        } else {
          console.log("🌐 Not in Mini App environment, running in browser");
        }
      } catch (error) {
        console.error("❌ Failed to initialize Farcaster SDK:", error);
        
        // Fallback: try to call ready() anyway if we're in an iframe
        if (typeof window !== "undefined" && window.parent !== window) {
          try {
            console.log("🔄 Attempting fallback ready() call...");
            await sdk.actions.ready();
            console.log("✅ Fallback ready() called successfully");
          } catch (fallbackError) {
            console.error("❌ Fallback ready() also failed:", fallbackError);
          }
        }
      }
    };

    // Call immediately when component mounts
    initializeApp();
  }, []);

  return null;
}
