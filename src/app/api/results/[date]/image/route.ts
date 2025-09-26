import { NextRequest } from "next/server";
import { renderOg } from "@/ui/og";
import { redis, k, todayUTC } from "@/lib/redis";
import { todaysPoll } from "@/lib/poll";

export const runtime = "edge";

export async function GET(req: NextRequest, { params }: { params: { date: string } }) {
  const date = params.date === "today" ? todayUTC() : params.date;
  const poll = (await redis.get<ReturnType<typeof todaysPoll>>(k.poll(date))) ?? todaysPoll(date);
  const counts = (await redis.hgetall<Record<string, number>>(k.counts(date))) ?? {};
  return renderOg({ question: `[${date}] ${poll.question}`, counts });
}
