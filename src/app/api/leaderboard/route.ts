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
    console.log("Leaderboard API: Starting request");
    
    // Optional: limit via search param ?limit=50
    const url = new URL(req.url);
    const limit = Number(url.searchParams.get("limit") ?? "50");
    const N = Number.isFinite(limit) && limit > 0 ? Math.min(limit, 200) : 50;
    
    console.log("Leaderboard API: Fetching leaderboard data with limit:", N);

    // Upstash returns flat array: [member, score, member, score, ...]
    const flat = await redis.zrange<string[]>("lb:points", -N, -1, { withScores: true });
    console.log("Leaderboard API: Raw leaderboard data:", flat);

    // Check if leaderboard is empty
    if (!flat || flat.length === 0) {
      console.log("Leaderboard API: No leaderboard data found, returning empty result");
      return NextResponse.json({ ok: true, rows: [] });
    }

    // Reverse to get highest scores first (descending order)
    const reversedFlat = flat.reverse();

    // batch hgetall to pull per-user stats for accuracy/streak
    console.log("Leaderboard API: Building pipeline for stats");
    const pipe = redis.pipeline();
    for (let i = 0; i < reversedFlat.length; i += 2) {
      pipe.hgetall(`stats:${reversedFlat[i]}`);
    }
    
    // Only execute pipeline if it has commands
    const statsArr = pipe.length > 0 ? await pipe.exec<Record<string, string>[]>() : [];
    console.log("Leaderboard API: Stats data:", statsArr);

    const rows: LeaderboardRow[] = [];
    for (let i = 0, r = 0; i < reversedFlat.length; i += 2, r++) {
      const fid = reversedFlat[i]!;
      const points = Number(reversedFlat[i + 1]!);
      const raw = statsArr[r] ?? {};
      const totalVotes = num(raw?.totalVotes);
      const correctCount = num(raw?.correctCount);
      const currentStreak = num(raw?.currentStreak);
      const accuracy = totalVotes ? Math.round((correctCount / totalVotes) * 100) : 0;

      rows.push({
        rank: r + 1,
        fid,
        points,
        totalVotes,
        currentStreak,
        accuracy,
      });
    }

    // Get all unique FIDs for bulk profile lookup
    const allFids = rows.map(row => row.fid);
    console.log("Leaderboard API: FIDs for profile lookup:", allFids);
    
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

    console.log("Leaderboard API: Returning hydrated rows:", hydratedRows.length);
    return NextResponse.json({ ok: true, rows: hydratedRows });
  } catch (error) {
    console.error("Leaderboard API error:", error);
    console.error("Leaderboard API error stack:", error instanceof Error ? error.stack : 'No stack trace');
    return NextResponse.json(
      { ok: false, error: "Failed to fetch leaderboard", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
