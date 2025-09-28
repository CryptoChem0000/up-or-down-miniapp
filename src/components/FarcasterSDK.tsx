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
          
          // Try multiple approaches to call ready()
          try {
            // Approach 1: Direct SDK import
            const { sdk } = await import("@farcaster/miniapp-sdk");
            console.log("SDK imported successfully");
            
            // Call ready() immediately
            await sdk.actions.ready();
            console.log("✅ SDK ready() called successfully");
            
            // Get context
            try {
              const context = await sdk.context;
              console.log("SDK Context:", context);
            } catch (contextError) {
              console.log("Context error:", contextError);
            }
            
          } catch (sdkError) {
            console.log("SDK approach failed:", sdkError);
            
            // Approach 2: Try postMessage
            try {
              window.parent.postMessage({ 
                type: "ready",
                source: "farcaster-miniapp"
              }, "*");
              console.log("✅ Sent ready message via postMessage");
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
