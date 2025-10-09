"use client";
import { useEffect, useState } from "react";

export default function FarcasterReady() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let mounted = true;
    
    const initializeSDK = async () => {
      try {
        console.log("🚀 FarcasterReady: Initializing SDK...");
        
        // Import SDK dynamically to avoid SSR issues
        const { sdk } = await import("@farcaster/miniapp-sdk");
        
        // Check if component is still mounted
        if (!mounted) return;
        
        // Check if we're in a Farcaster context
        if (typeof window !== "undefined") {
          const inIframe = window !== window.parent;
          console.log("📱 FarcasterReady: In iframe:", inIframe);
          
          if (inIframe) {
            // Wait for the main app content to be rendered before calling ready
            // This prevents jitter and content reflows
            await new Promise(resolve => setTimeout(resolve, 100));
            
            if (!mounted) return;
            
            console.log("📱 FarcasterReady: Calling sdk.actions.ready()...");
            await sdk.actions.ready();
            console.log("✅ FarcasterReady: SDK ready() called successfully");

            // Get user context and establish session
            try {
              console.log("🔐 FarcasterReady: Getting user context...");
              const context = await sdk.context;
              console.log("📋 FarcasterReady: User context:", context);
              
              if (!mounted) return;
              
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

            if (mounted) {
              setIsReady(true);
            }
          } else {
            console.log("ℹ️ FarcasterReady: Not in iframe, skipping ready() call");
            if (mounted) {
              setIsReady(true);
            }
          }
        }
      } catch (error) {
        console.error("❌ FarcasterReady: Error initializing SDK:", error);
        // Still set ready to true to avoid blocking the app
        if (mounted) {
          setIsReady(true);
        }
      }
    };

    // Initialize immediately (DOM is always ready in useEffect)
    initializeSDK();
    
    // Cleanup function
    return () => {
      mounted = false;
    };
  }, []);
  
  return null;
}