"use client";

import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

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

    const start = async () => {
      try {
        // If we're inside Farcaster iframe, wait for session to be ready
        if (typeof window !== "undefined" && window !== window.parent) {
          console.log("🔐 useResultToast: Waiting for session ready event...");
          await new Promise<void>((resolve) => {
            // If session already established, resolve immediately
            setTimeout(resolve, 0);
            const onReady = () => { 
              window.removeEventListener("fc:session-ready", onReady); 
              console.log("✅ useResultToast: Session ready event received");
              resolve(); 
            };
            window.addEventListener("fc:session-ready", onReady, { once: true });
            
            // Fallback timeout to prevent infinite waiting
            setTimeout(() => {
              window.removeEventListener("fc:session-ready", onReady);
              console.warn("⚠️ useResultToast: Session ready timeout, proceeding anyway");
              resolve();
            }, 5000);
          });
        }
        
        if (!alive) return;
        
        const r = await fetch("/api/results/me", { 
          cache: "no-store",
          credentials: "include", // Include session cookies
        });
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
    };

    start();

    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty deps - only run once on mount
}
