import { Redis } from "@upstash/redis";

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export const k = {
  poll: (date: string) => `poll:${date}`,
  votes: (date: string) => `poll:${date}:votes`,
  counts: (date: string) => `poll:${date}:counts`,
  priceOpen: (date: string) => `price:${date}:open`,
  priceOpenRaw: (date: string) => `price:${date}:open:raw`,
  priceClose: (date: string) => `price:${date}:close`,
  priceCloseRaw: (date: string) => `price:${date}:close:raw`,
  result: (date: string) => `result:${date}`,
  settled: (date: string) => `settled:${date}`,
  lockSettle: (date: string) => `lock:settle:${date}`,
  userStreak: (fid: string) => `user:${fid}:streak`,
  userPoints: (fid: string) => `user:${fid}:points`,
  userLedger: (fid: string) => `user:${fid}:ledger`,
};

export function todayUTC(): string {
  return new Date().toISOString().slice(0, 10);
}
