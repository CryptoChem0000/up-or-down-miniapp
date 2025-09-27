"use client";

import { useEffect } from "react";
import { useToast } from "@/lib/toast";

type MeResult = {
  ok: boolean;
  day: string;
  revealed: boolean;
  userVoted: boolean;
  votedDirection: "up" | "down" | null;
  resultDirection: "up" | "down" | null;
  correct: boolean;
  pointsEarned: number;
  streakAfter: number;
};

export function useResultToast() {
  const { toast } = useToast();

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        const r = await fetch("/api/results/me", { cache: "no-store" });
        if (!r.ok) return;
        const data: MeResult = await r.json();
        if (!alive || !data?.ok) return;

        // Only once per revealed day and only if user voted
        const key = `seen-result-${data.day}`;
        if (!data.revealed || !data.userVoted || localStorage.getItem(key)) return;

        if (data.correct) {
          toast({
            title: "Great Job! 🎉 Your Streak Increased",
            description: `+${(data.pointsEarned ?? 0).toLocaleString()} points earned • Streak: ${data.streakAfter ?? 0}`,
          });
        } else {
          toast({
            title: "Yikes! 😬 Your Streak Ended",
            description: `Result was ${data.resultDirection?.toUpperCase() || "—"}. Try again today!`,
          });
        }

        localStorage.setItem(key, "1");
      } catch {
        // ignore errors
      }
    })();

    return () => {
      alive = false;
    };
  }, [toast]);
}
