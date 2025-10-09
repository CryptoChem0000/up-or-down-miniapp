'use client';

import { useEffect, useRef } from 'react';

/**
 * Fires sdk.actions.ready() ASAP with retries and fallbacks.
 * Safe to mount once high in your tree (e.g., root layout).
 */
export default function FarcasterReadyBridge() {
  const done = useRef(false);

  useEffect(() => {
    console.log("🌉 FarcasterReadyBridge: Starting initialization...");
    console.log("🌉 FarcasterReadyBridge: User agent:", navigator.userAgent);
    console.log("🌉 FarcasterReadyBridge: In iframe:", window !== window.parent);
    
    let retryId: number | null = null;
    let watchdogId: number | null = null;

    const pingParentFallback = () => {
      try {
        // Legacy / raw fallbacks some clients understand
        window.parent?.postMessage({ type: 'launch_frame_ready' }, '*');
        window.parent?.postMessage({ type: 'miniapp.ready' }, '*');
        console.log('🌉 FarcasterReadyBridge: Sent fallback postMessage');
      } catch (e) {
        console.log('🌉 FarcasterReadyBridge: PostMessage failed:', e);
      }
      try {
        // Some iOS bridges expose webkit handlers
        (window as any)?.webkit?.messageHandlers?.frame?.postMessage?.({ type: 'ready' });
        console.log('🌉 FarcasterReadyBridge: Sent webkit message');
      } catch (e) {
        console.log('🌉 FarcasterReadyBridge: Webkit message failed:', e);
      }
    };

    const tryReady = async () => {
      if (done.current) return;
      try {
        console.log("🌉 FarcasterReadyBridge: Attempting to import SDK...");
        const { sdk } = await import('@farcaster/miniapp-sdk');
        console.log("🌉 FarcasterReadyBridge: SDK imported successfully");
        
        await sdk.actions.ready();     // ✅ preferred path
        done.current = true;
        if (retryId) window.clearInterval(retryId);
        if (watchdogId) window.clearTimeout(watchdogId);
        // optional: log to verify on device
        console.log('✅ Farcaster ready() OK');
      } catch (error) {
        console.log('🌉 FarcasterReadyBridge: SDK ready() failed:', error);
        // keep trying in iOS WebView
        pingParentFallback();
      }
    };

    // Call immediately, then retry every 750ms for up to 8s
    tryReady();
    retryId = window.setInterval(tryReady, 750);
    watchdogId = window.setTimeout(() => {
      if (!done.current) {
        // Last-ditch fallback ping
        pingParentFallback();
        console.warn('⚠️ Farcaster ready() watchdog elapsed; fallback ping sent.');
      }
    }, 8000);

    // Re-announce when the view becomes active again (iOS resumes)
    const onVis = () => {
      if (document.visibilityState === 'visible' && !done.current) tryReady();
    };
    document.addEventListener('visibilitychange', onVis);

    return () => {
      if (retryId) window.clearInterval(retryId);
      if (watchdogId) window.clearTimeout(watchdogId);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, []);

  return null;
}
