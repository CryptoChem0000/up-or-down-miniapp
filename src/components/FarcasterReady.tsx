"use client";

import { useEffect } from "react";
import { sdk } from "@farcaster/miniapp-sdk";

export default function FarcasterReady() {
  useEffect(() => {
    // Call ready() - it's safe to call even outside Mini App environment
    console.log("🚀 Calling sdk.actions.ready() from FarcasterReady component");
    sdk.actions.ready();           // ✅ dismisses the splash
    // optionally: sdk.actions.setTitle("ETHEREUM");
  }, []);
  return null;
}