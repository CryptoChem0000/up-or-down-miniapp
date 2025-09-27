"use client";

import { notFound } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

type State = {
  date: string;
  poll: { question: string; options: string[] };
  counts: Record<string, number>;
  price: { open: number | null; close: number | null };
  result: string | null;
  settled: boolean;
  imageUrl: string;
  frameUrl: string;
};

export default function TestPage() {
  // Block access in production
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  const [state, setState] = useState<State | null>(null);
  const [debugToken, setDebugToken] = useState<string>("");

  const refresh = useCallback(async () => {
    const r = await fetch("/api/debug/state", { cache: "no-store" });
    setState(await r.json());
  }, []);

  useEffect(() => {
    refresh();
    const id = setInterval(refresh, 3000);
    return () => clearInterval(id);
  }, [refresh]);

  const total = useMemo(() => {
    if (!state) return 0;
    const up = Number(state.counts.UP || 0);
    const down = Number(state.counts.DOWN || 0);
    return up + down;
  }, [state]);

  const castUrl = useMemo(() => {
    // share the root app page (has fc:miniapp meta) so clients open the mini app / frame
    if (typeof window === "undefined") return "";
    return window.location.origin;
  }, []);

  async function debugVote(choice: "UP" | "DOWN") {
    const r = await fetch("/api/debug/vote", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        ...(debugToken ? { "x-debug-token": debugToken } : {}),
      },
      body: JSON.stringify({ choice }),
    });
    const j = await r.json();
    if (!j.ok) {
      alert(j.error || "debug vote failed");
    }
    refresh();
  }

  return (
    <main style={{ width: 424, minHeight: 695, margin: "0 auto", background: "#0b0b0b", color: "#fff", padding: 16 }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>Daily One-Tap Poll — Test Panel</h1>
      <p style={{ opacity: 0.8, marginTop: 0 }}>
        Live status. Real votes require Farcaster frame actions. This page is for preview and optional debug voting.
      </p>

      {!state ? (
        <p>Loading…</p>
      ) : (
        <>
          <section style={{ marginTop: 12, padding: 12, border: "1px solid #222", borderRadius: 12 }}>
            <div style={{ fontSize: 14, opacity: 0.7 }}>Date</div>
            <div style={{ fontWeight: 700, marginBottom: 8 }}>{state.date}</div>
            <div style={{ fontSize: 14, opacity: 0.7 }}>Question</div>
            <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>{state.poll.question}</div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {["UP", "DOWN"].map((opt) => {
                const val = Number(state.counts[opt] || 0);
                const pct = total ? Math.round((val / total) * 100) : 0;
                return (
                  <div key={opt} style={{ border: "1px solid #333", borderRadius: 12, padding: 12 }}>
                    <div style={{ fontSize: 13, opacity: 0.8 }}>{opt}</div>
                    <div style={{ fontSize: 28, fontWeight: 800 }}>{pct}%</div>
                    <div style={{ fontSize: 12, opacity: 0.6 }}>{val} votes</div>
                  </div>
                );
              })}
            </div>

            <div style={{ marginTop: 12, display: "flex", gap: 12, flexWrap: "wrap" }}>
              <a href={state.imageUrl} target="_blank" rel="noreferrer" style={{ color: "#6cf" }}>
                Open results image →
              </a>
              <a href={state.frameUrl} target="_blank" rel="noreferrer" style={{ color: "#6cf" }}>
                Open frame endpoint →
              </a>
              <a
                href={`https://warpcast.com/~/compose?text=&embeds[]=${encodeURIComponent(castUrl)}`}
                target="_blank"
                rel="noreferrer"
                style={{ color: "#6cf" }}
              >
                Compose a cast with the Mini App →
              </a>
            </div>
          </section>

          <section style={{ marginTop: 12, padding: 12, border: "1px solid #222", borderRadius: 12 }}>
            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 8 }}>Prices & result (if snapped)</div>
            <div style={{ display: "flex", gap: 24, flexWrap: "wrap", fontSize: 14 }}>
              <div>Open: {state.price.open ?? "–"}</div>
              <div>Close: {state.price.close ?? "–"}</div>
              <div>Result: {state.result ?? "–"}</div>
              <div>Settled: {state.settled ? "yes" : "no"}</div>
            </div>
          </section>

          <section style={{ marginTop: 12, padding: 12, border: "1px solid #222", borderRadius: 12 }}>
            <div style={{ fontSize: 14, fontWeight: 700 }}>Debug vote (optional)</div>
            <div style={{ fontSize: 12, opacity: 0.7, marginBottom: 8 }}>
              Requires <code>ALLOW_DEBUG_VOTE=1</code> and your <code>DEBUG_TOKEN</code>.
            </div>
            <input
              placeholder="DEBUG_TOKEN"
              value={debugToken}
              onChange={(e) => setDebugToken(e.target.value)}
              style={{ width: "100%", padding: 8, borderRadius: 8, border: "1px solid #333", background: "#121212", color: "#fff", marginBottom: 8 }}
            />
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => debugVote("UP")} style={{ padding: "8px 12px", borderRadius: 8, background: "#1e88e5", border: 0, color: "#fff" }}>
                Vote UP (debug)
              </button>
              <button onClick={() => debugVote("DOWN")} style={{ padding: "8px 12px", borderRadius: 8, background: "#ef5350", border: 0, color: "#fff" }}>
                Vote DOWN (debug)
              </button>
            </div>
            <div style={{ fontSize: 12, opacity: 0.7, marginTop: 6 }}>
              These do not award points or record FIDs—use the real frame for that.
            </div>
          </section>
        </>
      )}
    </main>
  );
}
