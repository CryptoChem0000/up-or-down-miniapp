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
        // Check if we're in staging mode with mock data
        const isStagingWithMock = process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true";
        
        if (isStagingWithMock) {
          // Return mock leaderboard data for UX testing
          const mockLeaderboard: LeaderboardRow[] = [
            { rank: 1, fid: "1001", points: 1247, totalVotes: 31, currentStreak: 18, accuracy: 94, username: "crypto_whale", displayName: "Crypto Whale", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=whale" },
            { rank: 2, fid: "1002", points: 1189, totalVotes: 28, currentStreak: 15, accuracy: 92, username: "eth_trader", displayName: "ETH Trader", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=trader" },
            { rank: 3, fid: "1003", points: 1156, totalVotes: 29, currentStreak: 12, accuracy: 90, username: "defi_master", displayName: "DeFi Master", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=defi" },
            { rank: 4, fid: "1004", points: 1089, totalVotes: 26, currentStreak: 14, accuracy: 88, username: "alice.eth", displayName: "Alice", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=alice" },
            { rank: 5, fid: "1005", points: 1023, totalVotes: 25, currentStreak: 11, accuracy: 86, username: "bob.crypto", displayName: "Bob", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=bob" },
            { rank: 6, fid: "1006", points: 967, totalVotes: 23, currentStreak: 9, accuracy: 84, username: "chart_reader", displayName: "Chart Reader", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=chart" },
            { rank: 7, fid: "1007", points: 923, totalVotes: 22, currentStreak: 13, accuracy: 82, username: "hodl_king", displayName: "HODL King", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=hodl" },
            { rank: 8, fid: "1008", points: 889, totalVotes: 21, currentStreak: 8, accuracy: 80, username: "market_timer", displayName: "Market Timer", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=market" },
            { rank: 9, fid: "1009", points: 856, totalVotes: 20, currentStreak: 10, accuracy: 78, username: "bull_market", displayName: "Bull Market", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=bull" },
            { rank: 10, fid: "1010", points: 823, totalVotes: 19, currentStreak: 7, accuracy: 76, username: "diamond_hands", displayName: "Diamond Hands", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=diamond" },
            { rank: 11, fid: "1011", points: 789, totalVotes: 18, currentStreak: 6, accuracy: 74, username: "yield_farmer", displayName: "Yield Farmer", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=yield" },
            { rank: 12, fid: "1012", points: 756, totalVotes: 17, currentStreak: 5, accuracy: 72, username: "nft_collector", displayName: "NFT Collector", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=nft" },
            { rank: 13, fid: "1013", points: 723, totalVotes: 16, currentStreak: 4, accuracy: 70, username: "dao_member", displayName: "DAO Member", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=dao" },
            { rank: 14, fid: "1014", points: 689, totalVotes: 15, currentStreak: 3, accuracy: 68, username: "web3_builder", displayName: "Web3 Builder", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=web3" },
            { rank: 15, fid: "12345", points: 284, totalVotes: 23, currentStreak: 7, accuracy: 78, username: "alice.eth", displayName: "Alice", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=alice" }
          ];
          
          // Simulate loading delay
          setTimeout(() => {
            if (alive) {
              setRows(mockLeaderboard.slice(0, limit));
              setLoading(false);
            }
          }, 1000);
          return;
        }

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
