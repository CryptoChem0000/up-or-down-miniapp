import { NextResponse } from "next/server";
import { consensusMid } from "@/lib/prices";
import { redis, k, todayUTC } from "@/lib/redis";
import { CLOSE_SNAPSHOT_DELAY_MS } from "@/lib/rules";
import { settleDay } from "@/lib/settle";

export const dynamic = "force-dynamic";

export async function GET() {
  await new Promise(r => setTimeout(r, CLOSE_SNAPSHOT_DELAY_MS));
  const date = todayUTC();
  const openRaw = await redis.get<string | number>(k.priceOpen(date));
  if (!openRaw) return NextResponse.json({ ok: false, error: "open missing" }, { status: 500 });
  const open = Number(openRaw);

  const { mid, mids } = await consensusMid();
  if (!mid) return NextResponse.json({ ok: false, error: "no close sources" }, { status: 500 });

  await redis.set(k.priceClose(date), mid);
  await redis.set(k.priceCloseRaw(date), JSON.stringify({ mids, ts: Date.now() }));

  const lock = await redis.setnx(k.lockSettle(date), 1);
  if (!lock) return NextResponse.json({ ok: true, date, info: "settling elsewhere" });

  try {
    const res = await settleDay(date, open, mid);
    return NextResponse.json({ ok: true, date, open, close: mid, ...res });
  } finally {
    await redis.del(k.lockSettle(date));
  }
}
