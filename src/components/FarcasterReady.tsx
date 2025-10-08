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

            // Get user context and establish session
            try {
              console.log("🔐 FarcasterReady: Getting user context...");
              const context = await sdk.context;
              console.log("📋 FarcasterReady: User context:", context);
              
              if (context && context.user && context.user.fid) {
                // Establish session with the real FID
                console.log("🔑 FarcasterReady: Establishing session with FID:", context.user.fid);
                const response = await fetch("/api/auth/establish", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({ fid: context.user.fid.toString() }),
                });
                
                if (response.ok) {
                  console.log("✅ FarcasterReady: Session established successfully");
                } else {
                  console.error("❌ FarcasterReady: Failed to establish session:", response.status);
                }
              } else {
                console.warn("⚠️ FarcasterReady: No FID found in context");
              }
            } catch (contextError) {
              console.error("❌ FarcasterReady: Error getting user context:", contextError);
            }

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