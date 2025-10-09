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
    // Optional: limit via search param ?limit=50
    const url = new URL(req.url);
    const limit = Number(url.searchParams.get("limit") ?? "50");
    const N = Number.isFinite(limit) && limit > 0 ? Math.min(limit, 200) : 50;

    // Upstash returns flat array: [member, score, member, score, ...]
    const flat = await redis.zrange<string[]>("lb:points", -N, -1, { withScores: true });

    // Reverse to get highest scores first (descending order)
    const reversedFlat = flat.reverse();

    // batch hgetall to pull per-user stats for accuracy/streak
    const pipe = redis.pipeline();
    for (let i = 0; i < reversedFlat.length; i += 2) {
      pipe.hgetall(`stats:${reversedFlat[i]}`);
    }
    const statsArr = await pipe.exec<Record<string, string>[]>();

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
    
    // Wrap profile fetching in try-catch to prevent crashes
    let profiles: Record<string, any> = {};
    try {
      profiles = await getProfiles(allFids);
    } catch (error) {
      console.error("Error fetching profiles:", error);
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

    return NextResponse.json({ ok: true, rows: hydratedRows });
  } catch (error) {
    console.error("Leaderboard API error:", error);
    return NextResponse.json(
      { ok: false, error: "Failed to fetch leaderboard" },
      { status: 500 }
    );
  }
}
