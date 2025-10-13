import { NextResponse } from "next/server";
import { redis, k, todayUTC } from "@/lib/redis";
import { getMultipleUsernames, postMentionCast } from "@/lib/farcaster";
import { sendPushNotification } from "@/lib/webpush";
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
      console.log("🔔 Starting results cron job", isDryRun ? "(DRY RUN)" : "");
    }

    // Get yesterday's date and result
    const yesterday = new Date();
    yesterday.setUTCDate(yesterday.getUTCDate() - 1);
    const yesterdayStr = yesterday.toISOString().slice(0, 10);

    const resultKey = `result:${yesterdayStr}`;
    const resultRaw = await redis.get(resultKey);
    
    if (!resultRaw || typeof resultRaw !== 'string') {
      return NextResponse.json({ error: "no_result_for_yesterday" }, { status: 404 });
    }
    
    const result = resultRaw.toLowerCase();

    // Get all users who voted yesterday
    const yesterdayVotesKey = k.votes(yesterdayStr);
    const yesterdayVotes = await redis.hgetall(yesterdayVotesKey);
    
    if (!yesterdayVotes || Object.keys(yesterdayVotes).length === 0) {
      return NextResponse.json({ error: "no_votes_for_yesterday" }, { status: 404 });
    }

    // Get usernames for all voters
    const voterFids = Object.keys(yesterdayVotes);
    const usernames = await getMultipleUsernames(voterFids);

    let resultCount = 0;
    let mentionCount = 0;
    let pushCount = 0;

    for (const [fid, voteDataRaw] of Object.entries(yesterdayVotes)) {
      try {
        // Parse vote data
        let voteData;
        try {
          voteData = typeof voteDataRaw === 'string' ? JSON.parse(voteDataRaw) : voteDataRaw;
        } catch {
          continue;
        }

        const userVote = voteData.direction?.toLowerCase();
        if (!userVote) continue;

        // Check if user has notification consent
        const consentKey = `notif:consent:${fid}`;
        const consentRaw = await redis.get(consentKey);
        
        if (!consentRaw || typeof consentRaw !== 'string') continue;

        let consent;
        try {
          consent = JSON.parse(consentRaw);
        } catch {
          continue;
        }

        // Check if we've already notified about this result
        const lastNotifiedKey = `results:lastNotified:${fid}`;
        const lastNotified = await redis.get(lastNotifiedKey);
        if (lastNotified === yesterdayStr) {
          // Already notified about this result, skip
          continue;
        }

        const isCorrect = userVote === result;
        const username = usernames[fid];
        
        let resultText = `✅ Results are in! Yesterday's closing: ETH went ${result.toUpperCase()}. `;
        resultText += username ? `@${username} your vote was ${isCorrect ? 'CORRECT' : 'WRONG'}. ` : `Your vote was ${isCorrect ? 'CORRECT' : 'WRONG'}. `;
        resultText += `Open: ${baseUrl}/`;

        if (isDryRun) {
          console.log(`🔔 DRY RUN: Would notify FID ${fid} (@${username || 'unknown'}) - ${isCorrect ? 'CORRECT' : 'WRONG'} (mentions: ${consent.mentions}, webpush: ${consent.webpush})`);
          resultCount++;
          continue;
        }

        // Send Farcaster mention if enabled
        if (consent.mentions && username) {
          try {
            await postMentionCast({
              toFid: fid,
              text: resultText
            });
            mentionCount++;
          } catch (error) {
            console.error(`Failed to send result mention to FID ${fid}:`, error);
          }
        }

        // Send Web Push if enabled
        if (consent.webpush) {
          try {
            const pushTitle = `🎯 ${isCorrect ? 'Great Job!' : 'Yikes!'} ETH went ${result.toUpperCase()}`;
            const pushBody = isCorrect 
              ? `Your vote was CORRECT! 🎉 Check your updated stats.`
              : `Your vote was WRONG. 😬 ETH went ${result.toUpperCase()}.`;
            
            await sendPushNotification(fid, {
              title: pushTitle,
              body: pushBody,
              url: `${baseUrl}/`
            });
            pushCount++;
          } catch (error) {
            console.error(`Failed to send result push to FID ${fid}:`, error);
          }
        }

        // Mark as notified for this result
        await redis.set(lastNotifiedKey, yesterdayStr, { ex: 60 * 60 * 24 * 7 }); // 7 day expiry

        resultCount++;

        // Rate limiting
        await sleep(300);

      } catch (error) {
        console.error(`Error processing result notification for FID ${fid}:`, error);
      }
    }

    const response = {
      ok: true,
      resultCount,
      mentionCount,
      pushCount,
      yesterdayResult: result,
      dryRun: isDryRun
    };

    if (process.env.DEBUG_NOTIFS === "1" || isDryRun) {
      console.log("🔔 Results cron completed:", response);
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error in results cron:", error);
    return NextResponse.json({ error: "internal_error" }, { status: 500 });
  }
}
