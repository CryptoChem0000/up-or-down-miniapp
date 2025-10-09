"use client";
import { useEffect, useState } from "react";
import { useSession } from "@/components/SessionProvider";

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
  todayVote?: "up" | "down" | null;
  profile?: {
    username: string | null;
    displayName: string | null;
    avatar: string | null;
  };
  error?: string;
};

export function useMyStats() {
  const { sessionReady } = useSession();
  const [data, setData] = useState<MeResp | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!sessionReady) {
      console.log("🔐 useMyStats: Waiting for session to be ready...");
      return; // Don't fetch until session is ready
    }
    
    let alive = true;
    const abortController = new AbortController();
    
    const start = async () => {
      try {
        console.log("🔐 useMyStats: Session ready, fetching stats...");
        
        if (!alive) return;
        
        // Check if we're in staging mode with mock data
        const isStagingWithMock = process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true";
        // Also check if we're on a staging/preview deployment
        const isPreviewDeployment = window.location.hostname.includes('vercel.app') && window.location.hostname.includes('git-');
        console.log("🔍 useMyStats: NEXT_PUBLIC_USE_MOCK_DATA =", process.env.NEXT_PUBLIC_USE_MOCK_DATA);
        console.log("🔍 useMyStats: isStagingWithMock =", isStagingWithMock);
        console.log("🔍 useMyStats: isPreviewDeployment =", isPreviewDeployment);
        console.log("🔍 useMyStats: hostname =", window.location.hostname);
        
        if (isStagingWithMock || isPreviewDeployment) {
          console.log("🎭 useMyStats: Using mock data");
          // Return mock data for UX testing
          const mockData: MeResp = {
            ok: true,
            stats: {
              fid: "12345",
              totalVotes: 23,
              correctCount: 18,
              currentStreak: 7,
              bestStreak: 12,
              totalPoints: 12545
            },
            accuracy: 78,
            rank: 15,
            todayVote: "up", // Mock today's vote for testing
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

        const r = await fetch("/api/stats/me", { 
          cache: "no-store",
          credentials: "include", // Include session cookies
          signal: abortController.signal
        });
        const j: MeResp = await r.json();
        if (alive) setData(j);
      } catch (error) {
        if (alive) {
          if (error instanceof Error && error.name === 'AbortError') {
            console.log("🔐 useMyStats: Request aborted");
            // Don't set error state for aborted requests
          } else {
            console.error("🔐 useMyStats: Fetch error:", error);
            setData({ ok: false, error: "fetch_failed" });
          }
        }
      } finally {
        if (alive) setLoading(false);
      }
    };
    
    start();
    return () => { 
      alive = false;
      abortController.abort();
    };
  }, [sessionReady]);

  return { data, loading };
}
