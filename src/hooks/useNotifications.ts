import { useState, useEffect } from 'react';
import { useSession } from '@/components/SessionProvider';
import { usePush } from './usePush';

interface NotificationConsent {
  mentions: boolean;
  webpush: boolean;
  email?: string;
}

interface NotificationState {
  consent: NotificationConsent | null;
  isLoading: boolean;
  error: string | null;
  isSaving: boolean;
}

export function useNotifications() {
  const { sessionReady, fid } = useSession();
  const { isSupported: pushSupported, subscribe, unsubscribe, isSubscribed } = usePush();
  const [state, setState] = useState<NotificationState>({
    consent: null,
    isLoading: false,
    error: null,
    isSaving: false
  });

  // Fetch current consent settings
  useEffect(() => {
    if (!sessionReady || !fid) return;

    const fetchConsent = async () => {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      try {
        const response = await fetch('/api/notifications/consent', {
          credentials: 'include'
        });

        if (!response.ok) {
          throw new Error('Failed to fetch notification settings');
        }

        const data = await response.json();
        setState(prev => ({ ...prev, consent: data.consent, isLoading: false }));
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        setState(prev => ({ ...prev, error: errorMessage, isLoading: false }));
      }
    };

    fetchConsent();
  }, [sessionReady, fid]);

  const updateConsent = async (updates: Partial<NotificationConsent>): Promise<boolean> => {
    if (!state.consent) return false;

    setState(prev => ({ ...prev, isSaving: true, error: null }));

    try {
      const newConsent = { ...state.consent, ...updates };

      // Handle Web Push subscription changes
      if (updates.webpush !== undefined) {
        if (updates.webpush && !isSubscribed && pushSupported) {
          const subscribed = await subscribe();
          if (!subscribed) {
            // If subscription failed, don't enable webpush
            newConsent.webpush = false;
          }
        } else if (!updates.webpush && isSubscribed) {
          await unsubscribe();
        }
      }

      const response = await fetch('/api/notifications/consent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(newConsent)
      });

      if (!response.ok) {
        throw new Error('Failed to save notification settings');
      }

      const data = await response.json();
      setState(prev => ({ ...prev, consent: data.consent, isSaving: false }));
      return true;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setState(prev => ({ ...prev, error: errorMessage, isSaving: false }));
      return false;
    }
  };

  const toggleMentions = async () => {
    if (!state.consent) return;
    return updateConsent({ mentions: !state.consent.mentions });
  };

  const toggleWebPush = async () => {
    if (!state.consent) return;
    return updateConsent({ webpush: !state.consent.webpush });
  };

  return {
    ...state,
    pushSupported,
    isSubscribed,
    updateConsent,
    toggleMentions,
    toggleWebPush
  };
}
