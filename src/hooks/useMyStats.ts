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
        console.log("useMyStats: Fetching /api/stats/me");
        const r = await fetch("/api/stats/me", { cache: "no-store" });
        console.log("useMyStats: Response status:", r.status);
        const j: MeResp = await r.json();
        console.log("useMyStats: Response data:", j);
        if (alive) setData(j);
      } catch (error) {
        console.error("useMyStats: Fetch error:", error);
        if (alive) setData({ ok: false, error: "fetch_failed" });
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  return { data, loading };
}
