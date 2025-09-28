"use client";

import { useEffect } from "react";

export function FarcasterSDK() {
  useEffect(() => {
    const initializeSDK = async () => {
      console.log("Initializing Farcaster SDK...");
      
      try {
        // Check if we're in a Farcaster environment (iframe)
        if (typeof window !== "undefined" && window.parent !== window) {
          console.log("Detected iframe environment, attempting SDK initialization");
          
          try {
            // Import SDK exactly as shown in official documentation
            const { sdk } = await import("@farcaster/miniapp-sdk");
            console.log("SDK imported successfully");
            
            // Call ready() exactly as per official documentation
            // This is the critical call that hides the splash screen
            await sdk.actions.ready();
            console.log("✅ SDK ready() called successfully - splash screen should hide");
            
            // Get context for debugging
            try {
              const context = await sdk.context;
              console.log("SDK Context:", context);
            } catch (contextError) {
              console.log("Context error:", contextError);
            }
            
          } catch (sdkError) {
            console.log("SDK approach failed:", sdkError);
            
            // Fallback: Try postMessage
            try {
              window.parent.postMessage({ 
                type: "ready",
                source: "farcaster-miniapp"
              }, "*");
              console.log("✅ Sent ready message via postMessage fallback");
            } catch (postError) {
              console.log("PostMessage failed:", postError);
            }
          }
          
        } else {
          console.log("Not in iframe environment, skipping SDK initialization");
        }
      } catch (error) {
        console.log("SDK initialization failed:", error);
        
        // Fallback: Try postMessage anyway
        try {
          if (typeof window !== "undefined" && window.parent !== window) {
            window.parent.postMessage({ 
              type: "ready",
              source: "farcaster-miniapp-fallback"
            }, "*");
            console.log("✅ Fallback postMessage sent");
          }
        } catch (fallbackError) {
          console.log("Fallback also failed:", fallbackError);
        }
      }
    };

    // Try immediately and also with a delay
    initializeSDK();
    const timer = setTimeout(initializeSDK, 500);
    
    return () => clearTimeout(timer);
  }, []);

  return null; // This component doesn't render anything
}
