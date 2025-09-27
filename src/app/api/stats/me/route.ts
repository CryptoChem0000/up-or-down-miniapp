import { NextResponse } from "next/server";
import { redis } from "@/lib/redis";
import { getSessionFromRequest } from "@/lib/session";
import type { UserStats } from "@/lib/types";

export const runtime = "edge";

function num(x: unknown) {
  const n = Number(x);
  return Number.isFinite(n) ? n : 0;
}

export async function GET(req: Request) {
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

  return NextResponse.json({ ok: true, stats, accuracy, rank });
}
