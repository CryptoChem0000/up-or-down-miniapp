export const EPSILON = 0.001; // 0.10%
export const BASE_POINTS = 1000;
export const DAMPING_BETA = 0.6; // 0..1
export const MULTIPLIER_CAP = 32;

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
  const raw = Math.pow(2, (streakAfter - 1) * DAMPING_BETA);
  return Math.min(MULTIPLIER_CAP, raw);
}
