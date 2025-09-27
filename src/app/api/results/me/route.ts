import { NextResponse } from "next/server";
import { redis } from "@/lib/redis";
import { getSessionFromRequest } from "@/lib/session";

function lastGameDayUTC(): string {
  // If you reveal at ~00:01 UTC, "last game day" is yesterday (UTC)
  const now = new Date();
  const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  d.setUTCDate(d.getUTCDate() - 1);
  const yyyy = d.getUTCFullYear();
  const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(d.getUTCDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export const runtime = "edge";

export async function GET(req: Request) {
  const session = await getSessionFromRequest(req);
  if (!session) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const day = lastGameDayUTC();

  // Day result written by your settle cron
  // Expected fields: revealed="1" when live, resultDir="up"|"down"
  const dayKey = `day:${day}`;
  const dayData = await redis.hgetall<Record<string, string>>(dayKey);
  const revealed = dayData?.revealed === "1";
  const resultDirection = (dayData?.resultDir as "up" | "down" | undefined) || null;

  // What did user vote yesterday?
  const voteKey = `vote:${day}:${session.fid}`;
  const vote = await redis.hgetall<Record<string, string>>(voteKey); // { direction, ... } if present
  const userVoted = Boolean(vote?.direction);
  const votedDirection = (vote?.direction as "up" | "down" | undefined) || null;

  const correct = Boolean(revealed && userVoted && resultDirection && votedDirection === resultDirection);

  // Optional: what you stored at settle time
  // Suggested fields: points, streakAfter
  const awardKey = `award:${day}:${session.fid}`;
  const award = await redis.hgetall<Record<string, string>>(awardKey);
  const pointsEarned = Number(award?.points ?? 0);
  const streakAfter = Number(award?.streakAfter ?? 0);

  return NextResponse.json({
    ok: true,
    day,
    revealed,
    userVoted,
    votedDirection,
    resultDirection,
    correct,
    pointsEarned,
    streakAfter,
  });
}
