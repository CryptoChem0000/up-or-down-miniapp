import { NextResponse } from "next/server";
import { redis } from "@/lib/redis";

export const runtime = "edge";

export async function POST(req: Request) {
  // Only allow in staging/preview environments
  if (process.env.NODE_ENV === "production" && !process.env.VERCEL_ENV?.includes("preview")) {
    return NextResponse.json({ ok: false, error: "not available in production" }, { status: 404 });
  }

  // simple auth guard (set ADMIN_TOKEN in your env)
  const auth = req.headers.get("authorization");
  if (!auth || auth !== `Bearer ${process.env.ADMIN_TOKEN}`) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const {
    // ISO date you want to mock as "yesterday"
    day,                    // e.g. "2025-09-27"
    resultDir = "up",       // "up" | "down"
    userDir = "up",         // what the current user voted
    fid,                    // test FID (your own)
    points = 1000,
    streakAfter = 5,
  } = body;

  if (!day || !fid) {
    return NextResponse.json({ ok: false, error: "day and fid required" }, { status: 400 });
  }

  // what settle normally writes
  await redis.hset(`day:${day}`, { revealed: "1", resultDir });

  // simulate user's vote yesterday
  await redis.hset(`vote:${day}:${fid}`, { direction: userDir, votedAt: Date.now().toString() });

  // simulate award written at settle
  await redis.hset(`award:${day}:${fid}`, {
    points: String(points),
    streakAfter: String(streakAfter),
  });

  return NextResponse.json({ ok: true });
}
