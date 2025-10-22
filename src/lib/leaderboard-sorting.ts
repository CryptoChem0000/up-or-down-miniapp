import { redis } from './redis';
import { getProfiles } from './profile-cache';

export interface LeaderboardUser {
  fid: string;
  points: number;
  totalVotes: number;
  correctCount: number;
  currentStreak: number;
  accuracy: number;
  username?: string | null;
  displayName?: string | null;
  avatar?: string | null;
}

function num(x: unknown) {
  const n = Number(x);
  return Number.isFinite(n) ? n : 0;
}

export async function getSortedLeaderboard(limit: number = 15): Promise<LeaderboardUser[]> {
  // Get top users from Redis sorted set
  const flat = await redis.zrange<string[]>("lb:points", -limit, -1, { withScores: true });
  
  if (!flat || flat.length === 0) {
    return [];
  }

  // Build user data
  const pipe = redis.pipeline();
  for (let i = 0; i < flat.length; i += 2) {
    pipe.hgetall(`stats:${flat[i]}`);
  }
  
  const statsArr = await pipe.exec<Record<string, string>[]>();
  
  const users: LeaderboardUser[] = [];
  for (let i = 0; i < flat.length; i += 2) {
    const fid = flat[i]!;
    const points = Number(flat[i + 1]!);
    const raw = statsArr[Math.floor(i / 2)] ?? {};
    const totalVotes = num(raw?.totalVotes);
    const correctCount = num(raw?.correctCount);
    const currentStreak = num(raw?.currentStreak);
    const accuracy = totalVotes ? Math.round((correctCount / totalVotes) * 100) : 0;

    users.push({
      fid,
      points,
      totalVotes,
      correctCount,
      currentStreak,
      accuracy,
    });
  }

  // Get profiles
  const allFids = users.map(user => user.fid);
  let profiles: Record<string, any> = {};
  try {
    profiles = await getProfiles(allFids);
  } catch (error) {
    console.error("Error fetching profiles:", error);
  }

  // Hydrate with profile data
  const hydratedUsers = users.map(user => {
    const profile = profiles[user.fid];
    return {
      ...user,
      username: profile?.username ?? null,
      displayName: profile?.displayName ?? null,
      avatar: profile?.avatar ?? null,
    };
  });

  // Sort by points (desc), then accuracy (desc), then alphabetically
  return hydratedUsers.sort((a, b) => {
    // First: Sort by points (descending)
    if (a.points !== b.points) {
      return b.points - a.points;
    }
    
    // Second: Sort by accuracy (descending)
    if (a.accuracy !== b.accuracy) {
      return b.accuracy - a.accuracy;
    }
    
    // Third: Sort alphabetically by displayName or username
    const aName = a.displayName || a.username || a.fid;
    const bName = b.displayName || b.username || b.fid;
    return aName.localeCompare(bName);
  });
}

export async function getUserRankInLeaderboard(fid: string, limit: number = 15): Promise<number | null> {
  const sortedUsers = await getSortedLeaderboard(limit);
  const userIndex = sortedUsers.findIndex(user => user.fid === fid);
  return userIndex !== -1 ? userIndex + 1 : null;
}
