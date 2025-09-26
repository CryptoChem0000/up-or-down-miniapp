import { redis, k } from "./redis";
import { BASE_POINTS, classifyResult, multiplier } from "./poll";

export async function settleDay(date: string, open: number, close: number) {
  const result = classifyResult(open, close);
  await redis.set(k.result(date), result);

  const votes = await redis.hgetall<Record<string, "UP" | "DOWN">>(k.votes(date));
  if (!votes || Object.keys(votes).length === 0) {
    await redis.set(k.settled(date), 1);
    return { result, settledCount: 0 };
  }

  let settledCount = 0;
  for (const [fid, vote] of Object.entries(votes)) {
    if (result === "FLAT" || vote !== result) {
      await redis.set(k.userStreak(fid), 0);
      await redis.lpush(k.userLedger(fid), JSON.stringify({ date, vote, result, awarded: 0, streak_after: 0 }));
    } else {
      const sOld = Number(await redis.get(k.userStreak(fid))) || 0;
      const sNew = sOld + 1;
      const mult = multiplier(sNew);
      const award = Math.floor(BASE_POINTS * mult);
      await redis.set(k.userStreak(fid), sNew);
      await redis.incrby(k.userPoints(fid), award);
      await redis.lpush(k.userLedger(fid), JSON.stringify({ date, vote, result, awarded: award, streak_after: sNew }));
    }
    settledCount++;
  }

  await redis.set(k.settled(date), 1);
  return { result, settledCount };
}
