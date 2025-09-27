"use client";
import React from "react";
import { Trophy, Flame } from "lucide-react";

type LBRow = { fid: string; score: number };
type LBResp = { topPoints: LBRow[]; topStreak: LBRow[] };

export default function LeaderboardPage() {
  const [data, setData] = React.useState<LBResp | null>(null);
  React.useEffect(() => {
    fetch("/api/leaderboard", { cache: "no-store" }).then(r => r.json()).then(setData);
  }, []);

  return (
    <main className="min-h-screen bg-gray-900 text-white p-4 flex items-center justify-center">
      <div className="w-[424px] min-h-[695px] border border-gray-700 rounded-2xl p-6 space-y-6 bg-gray-900">
        <h1 className="text-xl font-bold text-center">Leaderboard</h1>

        <section>
          <div className="flex items-center gap-2 mb-3">
            <Trophy className="w-5 h-5 text-yellow-400" />
            <h2 className="font-semibold">Top Points</h2>
          </div>
          <div className="space-y-2">
            {(data?.topPoints ?? []).map((row, i) => (
              <div key={row.fid} className="flex justify-between px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-sm">
                <span className="opacity-70">#{i + 1} • FID {row.fid}</span>
                <span className="font-bold">{row.score.toLocaleString()} pts</span>
              </div>
            ))}
            {!data && <div className="text-sm opacity-60">Loading…</div>}
          </div>
        </section>

        <section>
          <div className="flex items-center gap-2 mb-3">
            <Flame className="w-5 h-5 text-orange-400" />
            <h2 className="font-semibold">Top Streaks</h2>
          </div>
          <div className="space-y-2">
            {(data?.topStreak ?? []).map((row, i) => (
              <div key={row.fid} className="flex justify-between px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-sm">
                <span className="opacity-70">#{i + 1} • FID {row.fid}</span>
                <span className="font-bold">{row.score} days</span>
              </div>
            ))}
            {!data && <div className="text-sm opacity-60">Loading…</div>}
          </div>
        </section>

        <div className="text-center text-xs opacity-70">
          Scores update after each daily settlement.
        </div>
      </div>
    </main>
  );
}
