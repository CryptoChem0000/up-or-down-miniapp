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

    // Get the user's global rank
    const globalRankRaw = await redis.zrevrank("lb:points", sess.fid);
    const globalRank = typeof globalRankRaw === "number" ? globalRankRaw + 1 : null;
    
    // For consistency with leaderboard display, we need to get the user's rank
    // from the same sorting logic used in the leaderboard API
    let rank = globalRank;
    
    // Get the top 15 leaderboard data to find the user's position
    try {
      const leaderboardResponse = await fetch(`${process.env.APP_BASE_URL || 'http://localhost:3000'}/api/leaderboard?limit=15`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (leaderboardResponse.ok) {
        const leaderboardData = await leaderboardResponse.json();
        if (leaderboardData.ok && leaderboardData.rows) {
          // Find the user's position in the sorted leaderboard
          const userIndex = leaderboardData.rows.findIndex((row: any) => row.fid === sess.fid);
          if (userIndex !== -1) {
            rank = userIndex + 1;
          }
        }
      }
    } catch (error) {
      console.error("Error fetching leaderboard for rank calculation:", error);
      // Fall back to global rank if leaderboard fetch fails
    }

    // Get today's vote (if any)
    const today = todayUTC();
    const todayVoteKey = k.votes(today);
    console.log(`🔍 Stats API: Looking for vote for FID ${sess.fid} on ${today} in key ${todayVoteKey}`);
    const todayVoteRaw = await redis.hget(todayVoteKey, sess.fid);
    console.log(`🔍 Stats API: Raw vote data for FID ${sess.fid}:`, todayVoteRaw);
    let todayVote = null;
    if (todayVoteRaw) {
      try {
        // Handle both string and object cases (Redis auto-deserialization)
        const voteData = typeof todayVoteRaw === 'string' ? JSON.parse(todayVoteRaw) : todayVoteRaw;
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
