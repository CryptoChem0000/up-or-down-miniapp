"use client";

export async function tryEstablishFcSession(): Promise<void> {
  try {
    // If in Farcaster iframe, get FID from SDK and establish session
    if (typeof window !== "undefined" && window !== window.parent) {
      console.log("🚀 tryEstablishFcSession: In iframe, initializing SDK...");
      
      // Import SDK dynamically to avoid SSR issues
      const { sdk } = await import("@farcaster/miniapp-sdk");
      
      // Wait for DOM to be ready before calling ready()
      await new Promise(resolve => setTimeout(resolve, 100));
      
      console.log("📱 tryEstablishFcSession: Calling sdk.actions.ready()...");
      await sdk.actions.ready();
      console.log("✅ tryEstablishFcSession: SDK ready() called successfully");
      
      // Get user context
      try {
        const context = await sdk.context;
        console.log("📋 tryEstablishFcSession: User context:", context);
        
        if (context && context.user && context.user.fid) {
          // Establish session with the FID
          console.log("🔑 tryEstablishFcSession: Establishing session with FID:", context.user.fid);
          const response = await fetch("/api/auth/establish", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({ fid: context.user.fid.toString() }),
          });
          
          if (response.ok) {
            console.log("✅ tryEstablishFcSession: Session established successfully");
            // Dispatch event to signal session is ready
            window.dispatchEvent(new Event("fc:session-ready"));
            console.log("📡 tryEstablishFcSession: Dispatched fc:session-ready event");
          } else {
            console.error("❌ tryEstablishFcSession: Failed to establish session:", response.status);
          }
        } else {
          console.warn("⚠️ tryEstablishFcSession: No FID found in context");
        }
      } catch (contextError) {
        console.error("❌ tryEstablishFcSession: Error getting user context:", contextError);
      }
    } else {
      // Not in iframe, just establish a basic session if possible
      console.log("ℹ️ tryEstablishFcSession: Not in iframe, attempting basic session...");
      await fetch("/api/auth/establish", {
        method: "POST",
        credentials: "include",
      }).catch(() => { /* swallow to avoid crashing hydration */ });
    }
  } catch (error) {
    console.error("❌ tryEstablishFcSession: Error:", error);
    // Don't throw - allow app to continue
  }
}

