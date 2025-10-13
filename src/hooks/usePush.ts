import { useState, useEffect } from 'react';
import { useSession } from '@/components/SessionProvider';

interface PushState {
  isSupported: boolean;
  isSubscribed: boolean;
  isLoading: boolean;
  error: string | null;
}

export function usePush() {
  const { sessionReady, fid } = useSession();
  const [state, setState] = useState<PushState>({
    isSupported: false,
    isSubscribed: false,
    isLoading: false,
    error: null
  });

  // Check if Web Push is supported and user is in mobile WebView
  useEffect(() => {
    if (!sessionReady) return;

    const userAgent = navigator.userAgent.toLowerCase();
    const isMobileWebView = userAgent.includes('farcaster') || userAgent.includes('warpcast');
    
    const isSupported = (
      'serviceWorker' in navigator &&
      'PushManager' in window &&
      'Notification' in window &&
      !isMobileWebView
    );

    setState(prev => ({ ...prev, isSupported }));

    if (isSupported) {
      checkSubscriptionStatus();
    }
  }, [sessionReady]);

  const checkSubscriptionStatus = async () => {
    try {
      if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
        return;
      }

      const registration = await navigator.serviceWorker.getRegistration('/sw.js');
      if (!registration) {
        setState(prev => ({ ...prev, isSubscribed: false }));
        return;
      }

      const subscription = await registration.pushManager.getSubscription();
      setState(prev => ({ ...prev, isSubscribed: !!subscription }));
    } catch (error) {
      console.error('Error checking subscription status:', error);
    }
  };

  const subscribe = async (): Promise<boolean> => {
    if (!state.isSupported || !fid) {
      setState(prev => ({ ...prev, error: 'Web Push not supported or no FID' }));
      return false;
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // Register service worker
      const registration = await navigator.serviceWorker.register('/sw.js');
      await navigator.serviceWorker.ready;

      // Request notification permission
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        throw new Error('Notification permission denied');
      }

      // Get VAPID public key from server
      const response = await fetch('/api/push/publicKey');
      const { publicKey } = await response.json();

      if (!publicKey) {
        throw new Error('Web Push not configured on server');
      }

      // Create push subscription
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey)
      });

      // Send subscription to server
      const subscribeResponse = await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ subscription })
      });

      if (!subscribeResponse.ok) {
        throw new Error('Failed to save subscription');
      }

      setState(prev => ({ ...prev, isSubscribed: true, isLoading: false }));
      return true;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setState(prev => ({ ...prev, error: errorMessage, isLoading: false }));
      return false;
    }
  };

  const unsubscribe = async (): Promise<boolean> => {
    if (!state.isSubscribed) return true;

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const registration = await navigator.serviceWorker.getRegistration('/sw.js');
      if (registration) {
        const subscription = await registration.pushManager.getSubscription();
        if (subscription) {
          await subscription.unsubscribe();
        }
      }

      // Note: Server-side cleanup happens when push notifications fail with 410/404
      setState(prev => ({ ...prev, isSubscribed: false, isLoading: false }));
      return true;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setState(prev => ({ ...prev, error: errorMessage, isLoading: false }));
      return false;
    }
  };

  return {
    ...state,
    subscribe,
    unsubscribe,
    checkSubscriptionStatus
  };
}

// Utility function to convert VAPID key
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
