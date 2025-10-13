import { NextResponse } from "next/server";
import { redis, k, todayUTC } from "@/lib/redis";
import { getMultipleUsernames, postMentionCast } from "@/lib/farcaster";
import { sendPushNotification } from "@/lib/webpush";
import { sendFarcasterNotification } from "@/lib/farcaster-notifications";
import { sleep } from "@/lib/utils";

export async function POST(req: Request) {
  try {
    // Check for admin token or Vercel cron
    const authHeader = req.headers.get("authorization");
    const adminToken = process.env.ADMIN_TOKEN;
    const isVercelCron = process.env.IS_VERCEL_CRON === "1";
    
    if (!isVercelCron && (!adminToken || authHeader !== `Bearer ${adminToken}`)) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    const url = new URL(req.url);
    const isDryRun = url.searchParams.get("dry") === "1";
    const baseUrl = process.env.APP_BASE_URL || "https://up-or-down-miniapp.vercel.app";

    if (process.env.DEBUG_NOTIFS === "1" || isDryRun) {
      console.log("🔔 Starting reminder cron job", isDryRun ? "(DRY RUN)" : "");
    }

    // Get all users with notification consent
    const consentKeys = await redis.keys("notif:consent:*");
    const today = todayUTC();
    
    let reminderCount = 0;
    let mentionCount = 0;
    let pushCount = 0;

    for (const consentKey of consentKeys) {
      try {
        const fid = consentKey.replace("notif:consent:", "");
        const consentRaw = await redis.get(consentKey);
        
        if (!consentRaw || typeof consentRaw !== 'string') continue;

        let consent;
        try {
          consent = JSON.parse(consentRaw);
        } catch {
          continue;
        }

        // Check if user has voted today
        const todayVote = await redis.hget(k.votes(today), fid);
        if (todayVote) {
          // User already voted, skip
          continue;
        }

        // Check if we've already reminded today
        const lastRemindedKey = `vote:lastRemindedDate:${fid}`;
        const lastRemindedDate = await redis.get(lastRemindedKey);
        if (lastRemindedDate === today) {
          // Already reminded today, skip
          continue;
        }

        const reminderText = `⏰ Daily reminder: vote UP or DOWN on ETH! Open: ${baseUrl}/launch`;
        
        if (isDryRun) {
          console.log(`🔔 DRY RUN: Would remind FID ${fid} (mentions: ${consent.mentions}, webpush: ${consent.webpush})`);
          reminderCount++;
          continue;
        }

        // Send Farcaster mention if enabled
        if (consent.mentions) {
          try {
            await postMentionCast({
              toFid: fid,
              text: reminderText
            });
            mentionCount++;
          } catch (error) {
            console.error(`Failed to send mention to FID ${fid}:`, error);
          }
        }

        // Try Farcaster native notifications first (mobile)
        try {
          const farcasterSent = await sendFarcasterNotification(fid, {
            title: "⏰ Daily ETH Vote Reminder",
            body: "Don't forget to vote UP or DOWN on ETH today!",
            targetUrl: `${baseUrl}/launch`
          });

          if (farcasterSent) {
            pushCount++;
          } else if (consent.webpush) {
            // Fallback to web push for desktop users
            await sendPushNotification(fid, {
              title: "⏰ Daily ETH Vote Reminder",
              body: "Don't forget to vote UP or DOWN on ETH today!",
              url: `${baseUrl}/launch`
            });
            pushCount++;
          }
        } catch (error) {
          console.error(`Failed to send push to FID ${fid}:`, error);
        }

        // Mark as reminded for today
        await redis.set(lastRemindedKey, today, { ex: 60 * 60 * 24 * 2 }); // 2 day expiry

        reminderCount++;

        // Rate limiting
        await sleep(300);

      } catch (error) {
        console.error(`Error processing reminder for consent key ${consentKey}:`, error);
      }
    }

    const result = {
      ok: true,
      reminderCount,
      mentionCount,
      pushCount,
      dryRun: isDryRun
    };

    if (process.env.DEBUG_NOTIFS === "1" || isDryRun) {
      console.log("🔔 Reminder cron completed:", result);
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error in reminder cron:", error);
    return NextResponse.json({ error: "internal_error" }, { status: 500 });
  }
}
