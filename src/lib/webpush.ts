import { redis } from './redis';

const VAPID_PUBLIC_KEY = process.env.VAPID_PUBLIC_KEY;
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY;
const VAPID_SUBJECT = process.env.VAPID_SUBJECT || 'mailto:admin@up-or-down-miniapp.vercel.app';

// Dynamic import for web-push to avoid Edge Runtime issues
async function getWebPush() {
  const webpush = await import('web-push');
  if (VAPID_PUBLIC_KEY && VAPID_PRIVATE_KEY) {
    webpush.default.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);
  }
  return webpush.default;
}

export async function sendPushNotification(fid: string, payload: { title: string; body: string; url?: string }): Promise<void> {
  const pushKey = `push:subs:${fid}`;
  const subscriptions = await redis.smembers(pushKey);

  if (subscriptions.length === 0) {
    if (process.env.DEBUG_NOTIFS === "1") {
      console.log(`🔔 No push subscriptions found for FID ${fid}`);
    }
    return;
  }

  const webpush = await getWebPush();

  const results = await Promise.allSettled(
    subscriptions.map(async (subscriptionStr) => {
      try {
        const subscription = JSON.parse(subscriptionStr);
        const result = await webpush.sendNotification(subscription, JSON.stringify(payload));
        
        if (process.env.DEBUG_NOTIFS === "1") {
          console.log(`🔔 Push sent to FID ${fid}:`, result.statusCode);
        }
        
        return { success: true, subscription };
      } catch (error: any) {
        // Handle expired/invalid subscriptions
        if (error.statusCode === 410 || error.statusCode === 404) {
          await redis.srem(pushKey, subscriptionStr);
          if (process.env.DEBUG_NOTIFS === "1") {
            console.log(`🔔 Removed expired subscription for FID ${fid}`);
          }
        }
        
        console.error(`🔔 Push failed for FID ${fid}:`, error.message);
        return { success: false, error: error.message };
      }
    })
  );

  const successful = results.filter(r => r.status === 'fulfilled' && r.value.success).length;
  if (process.env.DEBUG_NOTIFS === "1") {
    console.log(`🔔 Push results for FID ${fid}: ${successful}/${subscriptions.length} successful`);
  }
}

export function getVapidPublicKey(): string | null {
  return VAPID_PUBLIC_KEY || null;
}
