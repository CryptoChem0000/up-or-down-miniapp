import { NextRequest } from "next/server";
import { renderOg } from "@/ui/og";
import { redis, k, todayUTC } from "@/lib/redis";
import { todaysPoll } from "@/lib/poll";

export const runtime = "edge";

export async function GET(req: NextRequest, { params }: { params: { date: string } }) {
  const date = params.date === "today" ? todayUTC() : params.date;
  const poll = (await redis.get<ReturnType<typeof todaysPoll>>(k.poll(date))) ?? todaysPoll(date);
  const counts = (await redis.hgetall<Record<string, number>>(k.counts(date))) ?? {};
  const response = renderOg({ question: `[${date}] ${poll.question}`, counts });
  
  // Add aggressive cache-busting headers
  response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate, max-age=0');
  response.headers.set('Pragma', 'no-cache');
  response.headers.set('Expires', '0');
  response.headers.set('ETag', `"${Date.now()}"`);
  response.headers.set('Last-Modified', new Date().toUTCString());
  
  return response;
}
