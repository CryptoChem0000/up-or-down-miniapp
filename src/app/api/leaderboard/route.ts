import { NextResponse } from "next/server";
import { getSortedLeaderboard } from "@/lib/leaderboard-sorting";
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
    
    // Optional: limit via search param ?limit=15
    const url = new URL(req.url);
    const limit = Number(url.searchParams.get("limit") ?? "15");
    const N = Number.isFinite(limit) && limit > 0 ? Math.min(limit, 200) : 15;
    
    console.log(`[${requestId}] Leaderboard API: Fetching leaderboard data with limit:`, N);

    // Use shared sorting function
    const sortedUsers = await getSortedLeaderboard(N);
    
    // Convert to LeaderboardRow format with ranks
    const rows: LeaderboardRow[] = sortedUsers.map((user, index) => ({
      rank: index + 1,
      fid: user.fid,
      points: user.points,
      totalVotes: user.totalVotes,
      currentStreak: user.currentStreak,
      accuracy: user.accuracy,
      username: user.username,
      displayName: user.displayName,
      avatar: user.avatar,
    }));

    console.log(`[${requestId}] Leaderboard API: Returning sorted rows:`, rows.length);
    console.log(`[${requestId}] Leaderboard API: Response timestamp:`, new Date().toISOString());
    return NextResponse.json({ ok: true, rows, debug: { requestId, timestamp: new Date().toISOString() } });
  } catch (error) {
    console.error("Leaderboard API error:", error);
    console.error("Leaderboard API error stack:", error instanceof Error ? error.stack : 'No stack trace');
    return NextResponse.json(
      { ok: false, error: "Failed to fetch leaderboard", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
