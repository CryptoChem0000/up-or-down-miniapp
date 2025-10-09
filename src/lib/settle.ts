import { redis, k } from "./redis";
import { BASE_POINTS, classifyResult, multiplier } from "./poll";

export async function settleDay(date: string, open: number, close: number) {
  const result = classifyResult(open, close);
  await redis.set(k.result(date), result);

  // Write day result hash for /api/results/me
  const dayKey = `day:${date}`;
  const resultDir = result === "UP" ? "up" : result === "DOWN" ? "down" : null;
  await redis.hset(dayKey, {
    revealed: "1",
    resultDir: resultDir || "flat",
    open: open.toString(),
    close: close.toString(),
  });

  const votes = await redis.hgetall<Record<string, "UP" | "DOWN">>(k.votes(date));
  if (!votes || Object.keys(votes).length === 0) {
    await redis.set(k.settled(date), 1);
    return { result, settledCount: 0 };
  }

  let settledCount = 0;
  for (const [fid, vote] of Object.entries(votes)) {
    // Get current stats
    const statsKey = `stats:${fid}`;
    const currentStats = await redis.hgetall<Record<string, string>>(statsKey);
    const totalVotes = Number(currentStats?.totalVotes || 0) + 1;
    const correctCount = Number(currentStats?.correctCount || 0);
    const bestStreak = Number(currentStats?.bestStreak || 0);
    const totalPoints = Number(currentStats?.totalPoints || 0);
    
    if (result === "FLAT" || vote !== result) {
      // Incorrect or flat vote - reset streak
      await redis.set(k.userStreak(fid), 0);
      await redis.lpush(k.userLedger(fid), JSON.stringify({ date, vote, result, awarded: 0, streak_after: 0 }));
      // NEW: keep points as-is, but reset streak rank
      await redis.zadd("lb:streak", { score: 0, member: fid });
      
      // Update stats hash
      await redis.hset(statsKey, {
        totalVotes: totalVotes.toString(),
        correctCount: correctCount.toString(), // No increment for incorrect
        currentStreak: "0",
        bestStreak: bestStreak.toString(),
        totalPoints: totalPoints.toString(),
      });
      
      // Write award hash for incorrect/flat votes
      const awardKey = `award:${date}:${fid}`;
      await redis.hset(awardKey, {
        points: "0",
        streakAfter: "0",
      });
    } else {
      // Correct vote - increment streak and award points
      const sOld = Number(await redis.get(k.userStreak(fid))) || 0;
      const sNew = sOld + 1;
      const mult = multiplier(sNew);
      const award = Math.floor(BASE_POINTS * mult);
      const newTotalPoints = totalPoints + award;
      const newBestStreak = Math.max(bestStreak, sNew);
      
      await redis.set(k.userStreak(fid), sNew);
      await redis.incrby(k.userPoints(fid), award);
      await redis.lpush(k.userLedger(fid), JSON.stringify({ date, vote, result, awarded: award, streak_after: sNew }));
      // NEW: mirror into ZSETs for fast ranking
      await redis.zincrby("lb:points", award, fid);
      await redis.zadd("lb:streak", { score: sNew, member: fid }); // overwrite with new streak
      
      // Update stats hash
      await redis.hset(statsKey, {
        totalVotes: totalVotes.toString(),
        correctCount: (correctCount + 1).toString(),
        currentStreak: sNew.toString(),
        bestStreak: newBestStreak.toString(),
        totalPoints: newTotalPoints.toString(),
      });
      
      // Write award hash for correct votes
      const awardKey = `award:${date}:${fid}`;
      await redis.hset(awardKey, {
        points: award.toString(),
        streakAfter: sNew.toString(),
      });
    }
    settledCount++;
  }

  await redis.set(k.settled(date), 1);
  return { result, settledCount };
}
