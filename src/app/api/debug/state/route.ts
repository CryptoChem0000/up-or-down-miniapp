import { NextResponse } from "next/server";
import { redis, k, todayUTC } from "@/lib/redis";
import { todaysPoll } from "@/lib/poll";

export const runtime = "edge";

export async function GET() {
  const date = todayUTC();
  const poll = (await redis.get<ReturnType<typeof todaysPoll>>(k.poll(date))) ?? todaysPoll(date);
  const counts = (await redis.hgetall<Record<string, number>>(k.counts(date))) ?? {};
  const open = await redis.get<number | string>(k.priceOpen(date));
  const close = await redis.get<number | string>(k.priceClose(date));
  const result = await redis.get<string>(k.result(date));
  const settled = Boolean(await redis.get(k.settled(date)));

  return NextResponse.json({
    date,
    poll,
    counts,
    price: {
      open: open ? Number(open) : null,
      close: close ? Number(close) : null,
    },
    result: result ?? null,
    settled,
    imageUrl: `/api/results/today/image`,
    frameUrl: `/api/frames`
  });
}
