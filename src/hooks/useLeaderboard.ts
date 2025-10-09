"use client";
import { useEffect, useState } from "react";
import type { LeaderboardRow } from "@/lib/types";

export function useLeaderboard(limit = 50) {
  const [rows, setRows] = useState<LeaderboardRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const r = await fetch(`/api/leaderboard?limit=${limit}`, { 
          cache: "no-store",
          credentials: "include", // Include session cookies
        });
        const j = await r.json();
        if (alive && j?.ok) {
          setRows(j.rows);
        } else {
          console.error("Leaderboard API error:", j);
          // Fallback to mock data if API fails
          if (process.env.NODE_ENV === 'development' || window.location.hostname.includes('vercel.app')) {
            console.log("Using mock leaderboard data as fallback");
            setRows([
              { rank: 1, fid: "12345", points: 285, totalVotes: 25, currentStreak: 25, accuracy: 94, username: "alice.eth", displayName: "Alice", avatar: null },
              { rank: 2, fid: "67890", points: 234, totalVotes: 20, currentStreak: 18, accuracy: 91, username: "bob.crypto", displayName: "Bob", avatar: null },
              { rank: 3, fid: "11111", points: 218, totalVotes: 22, currentStreak: 22, accuracy: 88, username: "trader.defi", displayName: "Trader", avatar: null },
            ]);
          }
        }
      } catch (error) {
        console.error("Leaderboard fetch error:", error);
        // Fallback to mock data on network error
        if (process.env.NODE_ENV === 'development' || window.location.hostname.includes('vercel.app')) {
          console.log("Using mock leaderboard data due to network error");
          setRows([
            { rank: 1, fid: "12345", points: 285, totalVotes: 25, currentStreak: 25, accuracy: 94, username: "alice.eth", displayName: "Alice", avatar: null },
            { rank: 2, fid: "67890", points: 234, totalVotes: 20, currentStreak: 18, accuracy: 91, username: "bob.crypto", displayName: "Bob", avatar: null },
            { rank: 3, fid: "11111", points: 218, totalVotes: 22, currentStreak: 22, accuracy: 88, username: "trader.defi", displayName: "Trader", avatar: null },
          ]);
        }
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [limit]);

  return { rows, loading };
}
