"use client";

import { useEffect, useState } from "react";

export default function FarcasterDebug() {
  const [debugInfo, setDebugInfo] = useState<any>({});

  useEffect(() => {
    const debug = async () => {
      const info: any = {};
      
      // Environment detection
      info.inIframe = typeof window !== "undefined" && window.parent !== window;
      info.userAgent = typeof navigator !== "undefined" ? navigator.userAgent : "N/A";
      info.location = typeof window !== "undefined" ? window.location.href : "N/A";
      
      // Try to import SDK and see what happens
      try {
        console.log("🔍 Attempting to import @farcaster/miniapp-sdk...");
        const sdkModule = await import("@farcaster/miniapp-sdk");
        console.log("📦 SDK module imported:", sdkModule);
        info.sdkModule = Object.keys(sdkModule);
        
        // Check if sdk exists
        if (sdkModule.sdk) {
          info.sdkExists = true;
          info.sdkMethods = Object.keys(sdkModule.sdk);
          
          // Check if ready method exists
          if (sdkModule.sdk.ready) {
            info.readyMethod = "sdk.ready";
          } else if (sdkModule.sdk.actions && sdkModule.sdk.actions.ready) {
            info.readyMethod = "sdk.actions.ready";
          } else {
            info.readyMethod = "NOT FOUND";
          }
          
          // Try to call ready
          try {
            if (sdkModule.sdk.ready) {
              await sdkModule.sdk.ready();
              info.readyCallSuccess = "sdk.ready() worked";
            } else if (sdkModule.sdk.actions && sdkModule.sdk.actions.ready) {
              await sdkModule.sdk.actions.ready();
              info.readyCallSuccess = "sdk.actions.ready() worked";
            }
          } catch (readyError: any) {
            info.readyCallError = readyError.message;
          }
        } else {
          info.sdkExists = false;
        }
        
      } catch (importError: any) {
        info.importError = importError.message;
      }
      
      // Try frame-sdk as alternative
      try {
        console.log("🔍 Attempting to import @farcaster/frame-sdk...");
        const frameModule = await import("@farcaster/frame-sdk");
        console.log("📦 Frame SDK module imported:", frameModule);
        info.frameModule = Object.keys(frameModule);
        
        if (frameModule.default) {
          info.frameDefault = Object.keys(frameModule.default);
        }
      } catch (frameError: any) {
        info.frameError = frameError.message;
      }
      
      setDebugInfo(info);
      console.log("🔍 Debug info:", info);
    };

    debug();
  }, []);

  return (
    <div style={{ 
      position: "fixed", 
      top: 0, 
      left: 0, 
      right: 0, 
      bottom: 0, 
      background: "rgba(0,0,0,0.9)", 
      color: "white", 
      padding: "20px", 
      zIndex: 9999,
      fontFamily: "monospace",
      fontSize: "12px",
      overflow: "auto"
    }}>
      <h2>Farcaster Mini App Debug Info</h2>
      <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
    </div>
  );
}
