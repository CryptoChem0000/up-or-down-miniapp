export type UserStats = {
  fid: string;
  totalVotes: number;
  correctCount: number;
  currentStreak: number;
  bestStreak: number;
  totalPoints: number;
};

export type LeaderboardRow = {
  rank: number;
  fid: string;
  points: number;
  totalVotes: number;
  currentStreak: number;
  accuracy: number;
  username?: string | null;
  displayName?: string | null;
  avatar?: string | null;
};
