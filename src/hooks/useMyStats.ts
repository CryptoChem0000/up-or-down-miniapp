"use client";
import { useEffect, useState } from "react";

type MeResp = {
  ok: boolean;
  stats?: {
    fid: string;
    totalVotes: number;
    correctCount: number;
    currentStreak: number;
    bestStreak: number;
    totalPoints: number;
  };
  accuracy?: number;
  rank?: number | null;
  profile?: {
    username: string | null;
    displayName: string | null;
    avatar: string | null;
  };
  error?: string;
};

export function useMyStats() {
  const [data, setData] = useState<MeResp | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        // Check if we're in staging mode with mock data
        const isStagingWithMock = process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true";
        
        if (isStagingWithMock) {
          // Return mock data for UX testing
          const mockData: MeResp = {
            ok: true,
            stats: {
              fid: "12345",
              totalVotes: 23,
              correctCount: 18,
              currentStreak: 7,
              bestStreak: 12,
              totalPoints: 284
            },
            accuracy: 78,
            rank: 15,
            profile: {
              username: "alice.eth",
              displayName: "Alice",
              avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=alice"
            }
          };
          
          // Simulate loading delay
          setTimeout(() => {
            if (alive) {
              setData(mockData);
              setLoading(false);
            }
          }, 800);
          return;
        }

        const r = await fetch("/api/stats/me", { cache: "no-store" });
        const j: MeResp = await r.json();
        if (alive) setData(j);
      } catch (error) {
        if (alive) setData({ ok: false, error: "fetch_failed" });
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  return { data, loading };
}
