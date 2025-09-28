"use client";

import { useEffect } from "react";

export function FarcasterSDK() {
  useEffect(() => {
    const initializeSDK = async () => {
      try {
        // Check if we're in a Farcaster environment
        if (typeof window !== "undefined" && window.parent !== window) {
          // We're in an iframe, try to use the SDK
          const { sdk } = await import("@farcaster/miniapp-sdk");
          
          // Call ready() to hide the splash screen
          await sdk.actions.ready();
          console.log("Farcaster Mini App SDK initialized and ready");
          
          // Get and log context information for debugging
          const context = await sdk.context;
          console.log("SDK Context:", context);
          console.log("User:", context?.user);
          console.log("Client:", context?.client);
          console.log("Location:", context?.location);
          
          // Log available actions for debugging
          console.log("Available actions:", Object.keys(sdk.actions));
          
        } else {
          console.log("Not in Farcaster environment, skipping SDK initialization");
        }
      } catch (error) {
        console.log("Farcaster SDK not available:", error);
        // Try alternative approach - direct postMessage
        try {
          if (typeof window !== "undefined" && window.parent !== window) {
            window.parent.postMessage({ type: "ready" }, "*");
            console.log("Sent ready message via postMessage");
          }
        } catch (postError) {
          console.log("PostMessage also failed:", postError);
        }
      }
    };

    // Add a small delay to ensure the app is fully loaded
    const timer = setTimeout(initializeSDK, 100);
    return () => clearTimeout(timer);
  }, []);

  return null; // This component doesn't render anything
}
