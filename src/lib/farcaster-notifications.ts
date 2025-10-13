import { redis } from "./redis";

export interface FarcasterNotification {
  title: string;
  body: string;
  targetUrl?: string;
  notificationId?: string;
}

export async function sendFarcasterNotification(
  fid: string, 
  notification: FarcasterNotification
): Promise<boolean> {
  try {
    const notificationKey = `farcaster:notification:${fid}`;
    const tokenDataRaw = await redis.get(notificationKey);
    
    if (!tokenDataRaw) {
      console.log(`🔔 No Farcaster notification token found for FID ${fid}`);
      return false;
    }

    const tokenData = JSON.parse(tokenDataRaw);
    const { token, url } = tokenData;

    if (!token || !url) {
      console.error(`🔔 Invalid notification data for FID ${fid}:`, tokenData);
      return false;
    }

    const payload = {
      notificationId: notification.notificationId || `notif-${Date.now()}-${fid}`,
      title: notification.title,
      body: notification.body,
      targetUrl: notification.targetUrl || "https://up-or-down-miniapp.vercel.app/",
      tokens: [token]
    };

    console.log(`🔔 Sending Farcaster notification to FID ${fid}:`, payload.title);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`🔔 Failed to send Farcaster notification to FID ${fid}:`, response.status, errorText);
      return false;
    }

    const result = await response.json();
    console.log(`🔔 Successfully sent Farcaster notification to FID ${fid}:`, result);
    return true;

  } catch (error) {
    console.error(`🔔 Error sending Farcaster notification to FID ${fid}:`, error);
    return false;
  }
}

export async function getFarcasterNotificationStatus(fid: string): Promise<boolean> {
  try {
    const notificationKey = `farcaster:notification:${fid}`;
    const tokenDataRaw = await redis.get(notificationKey);
    return !!tokenDataRaw;
  } catch (error) {
    console.error(`🔔 Error checking Farcaster notification status for FID ${fid}:`, error);
    return false;
  }
}
