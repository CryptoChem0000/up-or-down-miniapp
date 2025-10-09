import { NextResponse } from "next/server";
import { redis, k } from "@/lib/redis";
import { settleDay } from "@/lib/settle";
import { requireCronAuth } from "@/lib/cron";

export const dynamic = "force-dynamic";

/**
 * Re-settlement endpoint for backfilling stats
 * Usage: GET /api/cron/resettle?date=2025-10-08
 */
export async function GET(req: Request) {
  // Protect cron route
  const authError = requireCronAuth(req);
  if (authError) return authError;

  const url = new URL(req.url);
  const date = url.searchParams.get("date");

  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json(
      { ok: false, error: "date parameter required (YYYY-MM-DD)" },
      { status: 400 }
    );
  }

  // Get existing prices
  const openRaw = await redis.get<string | number>(k.priceOpen(date));
  const closeRaw = await redis.get<string | number>(k.priceClose(date));

  if (!openRaw || !closeRaw) {
    return NextResponse.json(
      { ok: false, error: "missing price data", open: openRaw, close: closeRaw },
      { status: 500 }
    );
  }

  const open = Number(openRaw);
  const close = Number(closeRaw);

  // Clear settlement lock and flag to allow re-settlement
  await redis.del(k.lockSettle(date));
  await redis.del(k.settled(date));

  const lock = await redis.setnx(k.lockSettle(date), 1);
  if (!lock) {
    return NextResponse.json(
      { ok: true, date, info: "settling elsewhere" }
    );
  }

  try {
    const res = await settleDay(date, open, close);
    return NextResponse.json({
      ok: true,
      date,
      open,
      close,
      ...res,
      message: "Re-settlement complete"
    });
  } finally {
    await redis.del(k.lockSettle(date));
  }
}

