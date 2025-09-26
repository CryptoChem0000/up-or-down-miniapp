import { NextRequest, NextResponse } from "next/server";
import { redis, k, todayUTC } from "@/lib/redis";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  // Gate: must be explicitly enabled and token must match
  if (process.env.ALLOW_DEBUG_VOTE !== "1") {
    return NextResponse.json({ ok: false, error: "debug voting disabled" }, { status: 403 });
  }
  const token = req.headers.get("x-debug-token");
  if (!token || token !== process.env.DEBUG_TOKEN) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const { choice } = await req.json().catch(() => ({} as any));
  if (choice !== "UP" && choice !== "DOWN") {
    return NextResponse.json({ ok: false, error: "choice must be 'UP' or 'DOWN'" }, { status: 400 });
  }

  const date = todayUTC();
  await redis.hincrby(k.counts(date), choice, 1); // pure counter bump; does NOT record a fid vote

  const counts = (await redis.hgetall<Record<string, number>>(k.counts(date))) ?? {};
  return NextResponse.json({ ok: true, counts });
}
