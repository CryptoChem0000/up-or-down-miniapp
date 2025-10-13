import { redis } from './redis';

const VAPID_PUBLIC_KEY = process.env.VAPID_PUBLIC_KEY;
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY;
const VAPID_SUBJECT = process.env.VAPID_SUBJECT || 'mailto:admin@up-or-down-miniapp.vercel.app';

// Web Push functionality using fetch API instead of web-push package
async function sendWebPushNotification(subscription: any, payload: any): Promise<any> {
  const response = await fetch(subscription.endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `vapid t=${VAPID_PUBLIC_KEY}, k=${VAPID_PUBLIC_KEY}`,
      'TTL': '86400'
    },
    body: JSON.stringify(payload)
  });
  
  return { statusCode: response.status };
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

  const results = await Promise.allSettled(
    subscriptions.map(async (subscriptionStr) => {
      try {
        const subscription = JSON.parse(subscriptionStr);
        const result = await sendWebPushNotification(subscription, payload);
        
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
