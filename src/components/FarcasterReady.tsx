"use client";

import { useEffect } from "react";
// v0.3+ of the SDK
import { sdk, isMiniApp } from "@farcaster/miniapp-sdk";

export default function FarcasterReady() {
  useEffect(() => {
    // Only call in the Mini App container
    if (isMiniApp()) {
      // signal that your app is ready so the splash can disappear
      sdk.actions.ready();
      // (optional) set a title or other actions here
      // sdk.actions.setTitle("ETHEREUM");
    }
  }, []);

  return null;
}
