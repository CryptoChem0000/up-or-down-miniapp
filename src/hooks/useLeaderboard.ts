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
        // Check if we're in staging mode with mock data or preview deployment
        const isStagingWithMock = process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true";
        const isPreviewDeployment = typeof window !== 'undefined' && 
          window.location.hostname.includes('vercel.app') && 
          window.location.hostname.includes('git-');
        
        console.log("🔍 useLeaderboard: NEXT_PUBLIC_USE_MOCK_DATA =", process.env.NEXT_PUBLIC_USE_MOCK_DATA);
        console.log("🔍 useLeaderboard: isPreviewDeployment =", isPreviewDeployment);
        console.log("🔍 useLeaderboard: hostname =", typeof window !== 'undefined' ? window.location.hostname : 'server');
        
        if (isStagingWithMock || isPreviewDeployment) {
          console.log("🎭 useLeaderboard: Using mock data for preview");
          
          // Mock leaderboard data to test UI improvements
          const mockLeaderboardData: LeaderboardRow[] = [
            {
              fid: "1",
              rank: 1,
              username: "cryptowhale.eth",
              displayName: "CryptoWhale",
              currentStreak: 15,
              accuracy: 94,
              points: 28450,
              totalVotes: 47
            },
            {
              fid: "2",
              rank: 2,
              username: "tradingmaster",
              displayName: "Trading Master",
              currentStreak: 12,
              accuracy: 91,
              points: 26780,
              totalVotes: 42
            },
            {
              fid: "3",
              rank: 3,
              username: "ethpredictor",
              displayName: "ETH Predictor",
              currentStreak: 9,
              accuracy: 89,
              points: 24560,
              totalVotes: 38
            },
            {
              fid: "4",
              rank: 4,
              username: "defi_trader",
              displayName: "DeFi Trader",
              currentStreak: 8,
              accuracy: 87,
              points: 22340,
              totalVotes: 35
            },
            {
              fid: "5",
              rank: 5,
              username: "blockchain_analyst",
              displayName: "Blockchain Analyst",
              currentStreak: 7,
              accuracy: 85,
              points: 20120,
              totalVotes: 32
            },
            {
              fid: "6",
              rank: 6,
              username: "crypto_ninja",
              displayName: "Crypto Ninja",
              currentStreak: 6,
              accuracy: 83,
              points: 18900,
              totalVotes: 29
            },
            {
              fid: "7",
              rank: 7,
              username: "eth_enthusiast",
              displayName: "ETH Enthusiast",
              currentStreak: 5,
              accuracy: 81,
              points: 17680,
              totalVotes: 26
            },
            {
              fid: "8",
              rank: 8,
              username: "trading_pro",
              displayName: "Trading Pro",
              currentStreak: 4,
              accuracy: 79,
              points: 16460,
              totalVotes: 23
            },
            {
              fid: "9",
              rank: 9,
              username: "crypto_insider",
              displayName: "Crypto Insider",
              currentStreak: 3,
              accuracy: 77,
              points: 15240,
              totalVotes: 20
            },
            {
              fid: "10",
              rank: 10,
              username: "market_watcher",
              displayName: "Market Watcher",
              currentStreak: 2,
              accuracy: 75,
              points: 14020,
              totalVotes: 17
            }
          ];
          
          // Simulate loading delay
          setTimeout(() => {
            if (alive) {
              setRows(mockLeaderboardData.slice(0, limit));
              setLoading(false);
            }
          }, 1000);
          return;
        }

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
