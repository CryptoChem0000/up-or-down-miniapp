"use client";

import { useEffect } from "react";
// v0.3+ of the SDK
import { sdk } from "@farcaster/miniapp-sdk";

export default function FarcasterReady() {
  useEffect(() => {
    // Check if we're in a Farcaster environment (iframe)
    if (typeof window !== "undefined" && window.parent !== window) {
      // signal that your app is ready so the splash can disappear
      sdk.actions.ready();
      // (optional) set a title or other actions here
      // sdk.actions.setTitle("ETHEREUM");
    }
  }, []);

  return null;
}
