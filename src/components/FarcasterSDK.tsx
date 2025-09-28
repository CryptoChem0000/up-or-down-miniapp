"use client";

import { useEffect } from "react";
import init from "@farcaster/miniapp-sdk";

export function FarcasterSDK() {
  useEffect(() => {
    const initializeSDK = async () => {
      try {
        const sdk = init();
        // Tell Farcaster that the app is ready
        await sdk.actions.ready();
        console.log("Farcaster Mini App SDK initialized and ready");
      } catch (error) {
        console.log("Farcaster SDK not available (running outside Farcaster):", error);
        // This is expected when running outside of Farcaster
      }
    };

    initializeSDK();
  }, []);

  return null; // This component doesn't render anything
}
