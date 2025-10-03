"use client";
import { useEffect } from "react";
import { sdk, isMiniApp } from "@farcaster/miniapp-sdk";

export default function FarcasterReady() {
  useEffect(() => {
    if (isMiniApp()) {
      sdk.actions.ready();      // ✅ dismisses the splash in Warpcast
      // optional: sdk.actions.setTitle("ETHEREUM");
    }
  }, []);
  return null;
}