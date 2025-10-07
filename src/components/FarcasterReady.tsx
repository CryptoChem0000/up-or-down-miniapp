"use client";
import { useEffect, useState } from "react";

export default function FarcasterReady() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const initializeSDK = async () => {
      try {
        console.log("🚀 FarcasterReady: Initializing SDK...");
        
        // Import SDK dynamically to avoid SSR issues
        const { sdk } = await import("@farcaster/miniapp-sdk");
        
        // Check if we're in a Farcaster context
        if (typeof window !== "undefined") {
          const inIframe = window !== window.parent;
          console.log("📱 FarcasterReady: In iframe:", inIframe);
          
          if (inIframe) {
            console.log("📱 FarcasterReady: Calling sdk.actions.ready()...");
            await sdk.actions.ready();
            console.log("✅ FarcasterReady: SDK ready() called successfully");
            setIsReady(true);
          } else {
            console.log("ℹ️ FarcasterReady: Not in iframe, skipping ready() call");
            setIsReady(true);
          }
        }
      } catch (error) {
        console.error("❌ FarcasterReady: Error initializing SDK:", error);
        // Still set ready to true to avoid blocking the app
        setIsReady(true);
      }
    };

    // Wait for DOM to be ready and then initialize
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", initializeSDK);
      return () => {
        document.removeEventListener("DOMContentLoaded", initializeSDK);
      };
    } else {
      initializeSDK();
    }
  }, []);
  
  return null;
}