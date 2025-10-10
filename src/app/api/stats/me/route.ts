import { NextResponse } from "next/server";
import { redis, k, todayUTC } from "@/lib/redis";
import { getSessionFromRequest } from "@/lib/session";
import { getProfiles } from "@/lib/profile-cache";
import type { UserStats } from "@/lib/types";

export const runtime = "edge";

function num(x: unknown) {
  const n = Number(x);
  return Number.isFinite(n) ? n : 0;
}

export async function GET(req: Request) {
  try {
    const sess = await getSessionFromRequest(req);
    if (!sess) return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });

    const key = `stats:${sess.fid}`;
    const raw = await redis.hgetall<Record<string, string>>(key);

    const stats: UserStats = {
      fid: sess.fid,
      totalVotes: num(raw?.totalVotes),
      correctCount: num(raw?.correctCount),
      currentStreak: num(raw?.currentStreak),
      bestStreak: num(raw?.bestStreak),
      totalPoints: num(raw?.totalPoints),
    };
    const accuracy = stats.totalVotes ? Math.round((stats.correctCount / stats.totalVotes) * 100) : 0;

    const rankRaw = await redis.zrevrank("lb:points", sess.fid);
    const rank = typeof rankRaw === "number" ? rankRaw + 1 : null;

    // Get today's vote (if any)
    const today = todayUTC();
    const todayVoteKey = k.votes(today);
    console.log(`🔍 Stats API: Looking for vote for FID ${sess.fid} on ${today} in key ${todayVoteKey}`);
    const todayVoteRaw = await redis.hget(todayVoteKey, sess.fid);
    console.log(`🔍 Stats API: Raw vote data for FID ${sess.fid}:`, todayVoteRaw);
    let todayVote = null;
    if (todayVoteRaw && typeof todayVoteRaw === 'string') {
      try {
        const voteData = JSON.parse(todayVoteRaw);
        todayVote = voteData.direction; // "up" or "down"
        console.log(`🔍 Stats API: Parsed vote direction for FID ${sess.fid}:`, todayVote);
      } catch (parseError) {
        console.error("Error parsing today's vote for FID", sess.fid, ":", parseError);
      }
    } else {
      console.log(`🔍 Stats API: No vote found for FID ${sess.fid} today`);
    }

    // Fetch profile data for the current user with error handling
    let profile = null;
    try {
      const profiles = await getProfiles([sess.fid]);
      profile = profiles[sess.fid];
    } catch (profileError) {
      console.error("Error fetching profile for FID", sess.fid, ":", profileError);
      // Continue without profile data rather than failing completely
    }

    return NextResponse.json({ 
      ok: true, 
      stats, 
      accuracy, 
      rank,
      todayVote, // "up", "down", or null
      profile: {
        username: profile?.username ?? null,
        displayName: profile?.displayName ?? null,
        avatar: profile?.avatar ?? null,
      }
    });
  } catch (error) {
    console.error("Error in /api/stats/me:", error);
    return NextResponse.json({ ok: false, error: "internal_error" }, { status: 500 });
  }
}
