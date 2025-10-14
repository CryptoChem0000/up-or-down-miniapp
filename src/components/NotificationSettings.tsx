"use client";

import { useNotifications } from '@/hooks/useNotifications';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Bell, MessageCircle, Smartphone, Zap } from 'lucide-react';
import { sdk } from '@farcaster/miniapp-sdk';

export function NotificationSettings() {
  const { 
    consent, 
    isLoading, 
    error, 
    isSaving, 
    pushSupported, 
    isSubscribed,
    farcasterNotificationsEnabled,
    toggleMentions, 
    toggleWebPush,
    enableFarcasterNotifications
  } = useNotifications();

  if (isLoading) {
    return (
      <Card className="p-4 bg-gray-800 border-gray-700">
        <div className="flex items-center space-x-2 text-gray-400">
          <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm">Loading notification settings...</span>
        </div>
      </Card>
    );
  }

  if (!consent) {
    return (
      <Card className="p-4 bg-gray-800 border-gray-700">
        <div className="text-center text-gray-400">
          <p className="text-sm">Unable to load notification settings</p>
          {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4 bg-gray-800 border-gray-700">
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Bell className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-medium text-white">Notifications</h3>
        </div>

        {error && (
          <div className="p-2 bg-red-900/20 border border-red-500/20 rounded text-red-400 text-xs">
            {error}
          </div>
        )}

        <div className="space-y-3">
          {/* Farcaster Native Notifications */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Zap className="w-4 h-4 text-yellow-400" />
              <div>
                <Label htmlFor="farcaster" className="text-sm text-white">
                  Mobile notifications
                </Label>
                <p className="text-xs text-gray-400">
                  Get native push notifications in the Farcaster app
                </p>
              </div>
            </div>
            {farcasterNotificationsEnabled ? (
              <div className="flex items-center space-x-2">
                <span className="text-xs text-green-400">✓ Enabled</span>
              </div>
            ) : (
              <Button
                size="sm"
                onClick={enableFarcasterNotifications}
                disabled={isSaving}
                className="bg-yellow-600 hover:bg-yellow-700 text-white text-xs px-3 py-1"
              >
                Enable
              </Button>
            )}
          </div>

          {/* Farcaster Mentions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <MessageCircle className="w-4 h-4 text-blue-400" />
              <div>
                <Label htmlFor="mentions" className="text-sm text-white">
                  Warpcast mentions
                </Label>
                <p className="text-xs text-gray-400">
                  Get @mentioned in Warpcast when results are ready
                </p>
              </div>
            </div>
            <Switch
              id="mentions"
              checked={consent.mentions}
              onCheckedChange={toggleMentions}
              disabled={isSaving}
            />
          </div>

          {/* Web Push Notifications (Desktop only) */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Smartphone className="w-4 h-4 text-green-400" />
              <div>
                <Label htmlFor="webpush" className="text-sm text-white">
                  Browser notifications
                </Label>
                <p className="text-xs text-gray-400">
                  {pushSupported 
                    ? "Get push notifications in your browser"
                    : "Not available in Warpcast mobile app"
                  }
                </p>
              </div>
            </div>
            <Switch
              id="webpush"
              checked={consent.webpush}
              onCheckedChange={toggleWebPush}
              disabled={isSaving || !pushSupported}
            />
          </div>
        </div>

        {isSaving && (
          <div className="flex items-center space-x-2 text-gray-400">
            <div className="w-3 h-3 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            <span className="text-xs">Saving...</span>
          </div>
        )}

        <div className="text-xs text-gray-500 pt-2 border-t border-gray-700">
          <p>• Reminders sent at 8:00 PM UTC daily</p>
          <p>• Results sent at 12:05 AM UTC daily</p>
          <p>• You can change these settings anytime</p>
        </div>
      </div>
    </Card>
  );
}
