"use client";

import { useEffect } from "react";
import { sdk, isMiniApp } from "@farcaster/miniapp-sdk";

export default function FarcasterReady() {
  useEffect(() => {
    // Only signal inside the mini-app container
    if (isMiniApp()) {
      console.log("🚀 Calling sdk.actions.ready() from FarcasterReady component");
      sdk.actions.ready();           // ✅ dismisses the splash
      // optionally: sdk.actions.setTitle("ETHEREUM");
    } else {
      console.log("🌐 Not in Mini App environment, skipping ready() call");
    }
  }, []);
  return null;
}