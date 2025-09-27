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
  error?: string;
};

export function useMyStats() {
  const [data, setData] = useState<MeResp | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const r = await fetch("/api/stats/me", { cache: "no-store" });
        const j: MeResp = await r.json();
        if (alive) setData(j);
      } catch {
        if (alive) setData({ ok: false, error: "fetch_failed" });
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  return { data, loading };
}
