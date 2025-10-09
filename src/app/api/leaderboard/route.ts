import { NextResponse } from "next/server";
import { redis } from "@/lib/redis";
import { getProfiles } from "@/lib/profile-cache";
import type { LeaderboardRow } from "@/lib/types";

export const runtime = "edge";

function num(x: unknown) {
  const n = Number(x);
  return Number.isFinite(n) ? n : 0;
}

export async function GET(req: Request) {
  try {
    const requestId = Math.random().toString(36).substring(7);
    console.log(`[${requestId}] Leaderboard API: Starting request at ${new Date().toISOString()}`);
    
    // Optional: limit via search param ?limit=50
    const url = new URL(req.url);
    const limit = Number(url.searchParams.get("limit") ?? "50");
    const N = Number.isFinite(limit) && limit > 0 ? Math.min(limit, 200) : 50;
    
    console.log(`[${requestId}] Leaderboard API: Fetching leaderboard data with limit:`, N);

    // Upstash returns flat array: [member, score, member, score, ...]
    const flat = await redis.zrange<string[]>("lb:points", -N, -1, { withScores: true });
    console.log(`[${requestId}] Leaderboard API: Raw leaderboard data:`, flat);
    console.log(`[${requestId}] Leaderboard API: Redis URL:`, process.env.UPSTASH_REDIS_REST_URL);
    console.log(`[${requestId}] Leaderboard API: Redis token prefix:`, process.env.UPSTASH_REDIS_REST_TOKEN?.substring(0, 10));

    // Check if leaderboard is empty
    if (!flat || flat.length === 0) {
      console.log("Leaderboard API: No leaderboard data found, returning empty result");
      return NextResponse.json({ ok: true, rows: [] });
    }

    // Redis zrange with -N, -1 already returns highest scores first (descending order)
    // No need to reverse - just use flat directly
    const reversedFlat = flat;

    // batch hgetall to pull per-user stats for accuracy/streak
    console.log("Leaderboard API: Building pipeline for stats");
    const pipe = redis.pipeline();
    for (let i = 0; i < reversedFlat.length; i += 2) {
      pipe.hgetall(`stats:${reversedFlat[i]}`);
    }
    
    // Only execute pipeline if it has commands
    const statsArr = await pipe.exec<Record<string, string>[]>();
    console.log("Leaderboard API: Stats data:", statsArr);

    const rows: LeaderboardRow[] = [];
    for (let i = 0, r = 0; i < reversedFlat.length; i += 2, r++) {
      const fid = reversedFlat[i]!;
      const points = Number(reversedFlat[i + 1]!);
      console.log(`[${requestId}] Leaderboard API: Processing row ${r}, i=${i}, fid=${fid}, points=${points}`);
      const raw = statsArr[r] ?? {};
      const totalVotes = num(raw?.totalVotes);
      const correctCount = num(raw?.correctCount);
      const currentStreak = num(raw?.currentStreak);
      const accuracy = totalVotes ? Math.round((correctCount / totalVotes) * 100) : 0;

      const row = {
        rank: r + 1,
        fid,
        points,
        totalVotes,
        currentStreak,
        accuracy,
      };
      console.log(`[${requestId}] Leaderboard API: Created row:`, row);
      rows.push(row);
    }

    // Get all unique FIDs for bulk profile lookup
    console.log(`[${requestId}] Leaderboard API: Rows before profile lookup:`, rows);
    const allFids = rows.map(row => row.fid);
    console.log(`[${requestId}] Leaderboard API: FIDs for profile lookup:`, allFids);
    
    // Wrap profile fetching in try-catch to prevent crashes
    let profiles: Record<string, any> = {};
    try {
      console.log("Leaderboard API: Fetching profiles...");
      profiles = await getProfiles(allFids);
      console.log("Leaderboard API: Profiles fetched:", profiles);
    } catch (error) {
      console.error("Leaderboard API: Error fetching profiles:", error);
      // Continue without profiles rather than crashing
    }

    // Hydrate with profile data
    const hydratedRows = rows.map(row => {
      const profile = profiles[row.fid];
      return {
        ...row,
        username: profile?.username ?? null,
        displayName: profile?.displayName ?? null,
        avatar: profile?.avatar ?? null,
      };
    });

    console.log(`[${requestId}] Leaderboard API: Returning hydrated rows:`, hydratedRows.length);
    console.log(`[${requestId}] Leaderboard API: Response timestamp:`, new Date().toISOString());
    return NextResponse.json({ ok: true, rows: hydratedRows, debug: { requestId, timestamp: new Date().toISOString() } });
  } catch (error) {
    console.error("Leaderboard API error:", error);
    console.error("Leaderboard API error stack:", error instanceof Error ? error.stack : 'No stack trace');
    return NextResponse.json(
      { ok: false, error: "Failed to fetch leaderboard", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
