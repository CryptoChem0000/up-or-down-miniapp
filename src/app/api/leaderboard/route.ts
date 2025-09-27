import { NextRequest, NextResponse } from "next/server";
import { redis } from "@/lib/redis";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const n = Number(url.searchParams.get("n") || 15);

  // Upstash returns [[member, score], ...] with zrange + withScores, use the variant available in your SDK
  const pts = await redis.zrange<string[]>("lb:points", -n, -1, { withScores: true });
  const streaks = await redis.zrange<string[]>("lb:streak", -n, -1, { withScores: true });

  // normalize from ascending → descending and to [{fid, score}]
  const toList = (arr: any[]) => {
    // arr might be flat or pair tuples depending on client—handle both
    const pairs: Array<[string, number]> = Array.isArray(arr[0])
      ? (arr as Array<[string, number]>)
      : (arr as any[]).reduce((acc, v, i, a) => (i % 2 ? (acc[acc.length - 1][1] = Number(v), acc) : (acc.push([String(v), 0]), acc)), [] as Array<[string, number]>);
    return pairs.reverse().map(([fid, score]) => ({ fid, score: Number(score) }));
  };

  return NextResponse.json({
    topPoints: toList(pts),
    topStreak: toList(streaks),
  });
}
