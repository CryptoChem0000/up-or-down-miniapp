import { NextRequest, NextResponse } from "next/server";
import { redis } from "@/lib/redis";
import { getProfiles } from "@/lib/profile-cache";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const n = Number(url.searchParams.get("n") || 15);

  // Pull top N by points
  const pts = await redis.zrange<string[]>("lb:points", -n, -1, { withScores: true });
  const streaks = await redis.zrange<string[]>("lb:streak", -n, -1, { withScores: true });

  // normalize from ascending → descending and to [{fid, score}]
  const toList = (arr: any[]) => {
    // arr might be flat or pair tuples depending on client—handle both
    const pairs: Array<[string, number]> = Array.isArray(arr[0])
      ? (arr as Array<[string, number]>)
      : (arr as any[]).reduce((acc, v, i, a) => (i % 2 ? (acc[acc.length - 1][1] = Number(v), acc) : (acc.push([String(v), 0]), acc)), [] as Array<[string, number]>);
    return pairs.reverse().map(([fid, score], i) => ({ fid, score: Number(score), rank: i + 1 }));
  };

  const topPoints = toList(pts);
  const topStreak = toList(streaks);

  // Get all unique FIDs for bulk profile lookup
  const allFids = Array.from(new Set([
    ...topPoints.map(p => p.fid),
    ...topStreak.map(s => s.fid)
  ]));

  // Bulk fetch profiles
  const profiles = await getProfiles(allFids);

  // Hydrate with profile data
  const hydrateWithProfiles = (entries: any[]) => entries.map(entry => {
    const profile = profiles[entry.fid];
    return {
      ...entry,
      username: profile?.username ?? null,
      displayName: profile?.displayName ?? null,
      avatar: profile?.avatar ?? null,
    };
  });

  return NextResponse.json({
    topPoints: hydrateWithProfiles(topPoints),
    topStreak: hydrateWithProfiles(topStreak),
  });
}
