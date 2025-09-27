import { NextResponse } from "next/server";
import { consensusMid } from "@/lib/prices";
import { redis, k, todayUTC } from "@/lib/redis";
import { todaysPoll } from "@/lib/poll";
import { OPEN_SNAPSHOT_DELAY_MS } from "@/lib/rules";
import { requireCronAuth } from "@/lib/cron";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  // Protect cron route
  const authError = requireCronAuth(req);
  if (authError) return authError;
  await new Promise(r => setTimeout(r, OPEN_SNAPSHOT_DELAY_MS));
  const date = todayUTC();
  const exists = await redis.get(k.poll(date));
  if (!exists) await redis.set(k.poll(date), todaysPoll(date));

  const { mid, mids } = await consensusMid();
  if (!mid) return NextResponse.json({ ok: false, error: "no sources" }, { status: 500 });

  await redis.set(k.priceOpen(date), mid);
  await redis.set(k.priceOpenRaw(date), JSON.stringify({ mids, ts: Date.now() }));

  return NextResponse.json({ ok: true, date, open: mid, sources: mids });
}
