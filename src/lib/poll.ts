export const EPSILON = 0.001; // 0.10%
export const BASE_POINTS = 100;
export const DAMPING_BETA = 0.6; // 0..1
export const MULTIPLIER_CAP = 32;
export const STREAK_CAP = 10; // Cap multiplier calculation at streak 10

export type PollDoc = {
  date: string;
  question: string;
  options: ("UP" | "DOWN")[];
  maxVotesPerFid: 1;
};

export function todaysPoll(date: string): PollDoc {
  return {
    date,
    question: "ETH up or down today?",
    options: ["UP", "DOWN"],
    maxVotesPerFid: 1,
  };
}

export type DayResult = "UP" | "DOWN" | "FLAT";

export function classifyResult(open: number, close: number): DayResult {
  const r = (close - open) / open;
  if (r > +EPSILON) return "UP";
  if (r < -EPSILON) return "DOWN";
  return "FLAT";
}

export function multiplier(streakAfter: number): number {
  // Cap streak at STREAK_CAP for multiplier calculation, but allow tracking to continue
  const cappedStreak = Math.min(streakAfter, STREAK_CAP);
  const raw = Math.pow(2, (cappedStreak - 1) * DAMPING_BETA);
  const capped = Math.min(MULTIPLIER_CAP, raw);
  // Round to nearest 10th (multiply by 10, round, divide by 10)
  return Math.round(capped * 10) / 10;
}
