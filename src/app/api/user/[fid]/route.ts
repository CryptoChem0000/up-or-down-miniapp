import { NextResponse } from "next/server";
import { redis, k } from "@/lib/redis";

export async function GET(_: Request, { params }: { params: { fid: string } }) {
  const fid = params.fid;
  const streak = Number((await redis.get(k.userStreak(fid))) || 0);
  const points = Number((await redis.get(k.userPoints(fid))) || 0);
  return NextResponse.json({ streak, points });
}
