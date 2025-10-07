"use client";
import { useEffect } from "react";
import { sdk } from "@farcaster/miniapp-sdk";

export default function FarcasterReady() {
  useEffect(() => {
    console.log("🚀 FarcasterReady component mounted");
    
    // Try to call ready() immediately
    const callReady = async () => {
      try {
        console.log("📱 Calling sdk.actions.ready()...");
        await sdk.actions.ready();
        console.log("✅ sdk.actions.ready() called successfully");
      } catch (error) {
        console.error("❌ Error calling sdk.actions.ready():", error);
      }
    };

    // Call ready immediately
    callReady();

    // Also call ready after a short delay to handle timing issues
    const timeoutId = setTimeout(() => {
      console.log("🔄 Calling sdk.actions.ready() again after delay...");
      callReady();
    }, 100);

    // Cleanup timeout on unmount
    return () => {
      clearTimeout(timeoutId);
    };
  }, []);
  
  return null;
}