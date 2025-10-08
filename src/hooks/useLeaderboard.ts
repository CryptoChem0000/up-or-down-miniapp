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
        const r = await fetch(`/api/leaderboard?limit=${limit}`, { cache: "no-store" });
        const j = await r.json();
        if (alive && j?.ok) setRows(j.rows);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [limit]);

  return { rows, loading };
}
