"use client";
import { useEffect, useState } from "react";
import type { LeaderboardRow } from "@/lib/types";

export function useLeaderboard(limit = 50) {
  const [rows, setRows] = useState<LeaderboardRow[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Force fresh deployment - no mock data in production

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
          setRows([]); // Set empty array on error, no mock data
        }
      } catch (error) {
        console.error("Leaderboard fetch error:", error);
        setRows([]); // Set empty array on error, no mock data
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [limit]);

  return { rows, loading };
}
