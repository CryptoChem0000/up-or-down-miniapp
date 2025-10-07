/* eslint-disable @next/next/no-img-element */
import { ImageResponse } from "@vercel/og";

export type OgProps = {
  question: string;
  counts: Record<string, number>;
  highlight?: "UP" | "DOWN";
  subtitle?: string;
};

export function renderOg({ question, counts, highlight, subtitle }: OgProps) {
  const up = Number(counts["UP"] || 0);
  const down = Number(counts["DOWN"] || 0);
  const total = Math.max(1, up + down);
  const upPct = Math.round((up / total) * 100);
  const downPct = 100 - upPct;

  // Mock ETH price data for the preview
  const ethPrice = "$4,516.34";
  const priceChange = "-3.96%";
  const priceChangeAbs = "$-178.92";

  return new ImageResponse(
    (
      <div
        style={{
          width: 1200, 
          height: 800, 
          display: "flex", 
          flexDirection: "column",
          background: "#0b0b0b",
          color: "white", 
          fontFamily: "Inter, sans-serif", 
          padding: 40,
          position: "relative"
        }}
      >
        {/* Header with Logo and Title */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 32 }}>
          <div style={{ fontSize: 48, fontWeight: 700, marginRight: 16 }}>Ethereum</div>
          <img
            src="https://up-or-down-miniapp.vercel.app/icon-256.png"
            alt="ETH Logo"
            width={60}
            height={60}
            style={{ borderRadius: 12 }}
          />
        </div>

        {/* Question */}
        <div style={{ fontSize: 32, textAlign: "center", marginBottom: 40, opacity: 0.9 }}>
          Will ETH price go up or down today?
        </div>

        {/* ETH Price Card */}
        <div style={{ 
          backgroundColor: "#1a1a1a", 
          borderRadius: 16, 
          padding: 24, 
          marginBottom: 32,
          display: "flex",
          flexDirection: "column",
          alignItems: "center"
        }}>
          <div style={{ fontSize: 18, opacity: 0.7, marginBottom: 12 }}>Current ETH Price</div>
          <div style={{ fontSize: 72, fontWeight: 800, marginBottom: 16 }}>{ethPrice}</div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ 
              backgroundColor: "#dc2626", 
              color: "white", 
              padding: "8px 16px", 
              borderRadius: 20, 
              fontSize: 16,
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: 8
            }}>
              <span>📉</span>
              {priceChange}
            </div>
            <div style={{ fontSize: 18, color: "#dc2626", fontWeight: 600 }}>{priceChangeAbs}</div>
          </div>
          <div style={{ fontSize: 14, opacity: 0.6, marginTop: 8 }}>24h change</div>
        </div>

        {/* Make Your Prediction */}
        <div style={{ fontSize: 24, textAlign: "center", marginBottom: 24, fontWeight: 600 }}>
          Make Your Prediction
        </div>

        {/* UP/DOWN Buttons */}
        <div style={{ display: "flex", gap: 24, marginBottom: 32 }}>
          <div style={{
            backgroundColor: "#16a34a",
            color: "white",
            padding: "20px 40px",
            borderRadius: 16,
            fontSize: 28,
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            gap: 12,
            flex: 1,
            justifyContent: "center"
          }}>
            <span>📈</span>
            UP
          </div>
          <div style={{
            backgroundColor: "#dc2626",
            color: "white",
            padding: "20px 40px",
            borderRadius: 16,
            fontSize: 28,
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            gap: 12,
            flex: 1,
            justifyContent: "center"
          }}>
            <span>📉</span>
            DOWN
          </div>
        </div>

        {/* Stats Card */}
        <div style={{ 
          backgroundColor: "#1a1a1a", 
          borderRadius: 16, 
          padding: 24,
          display: "flex",
          flexDirection: "column",
          alignItems: "center"
        }}>
          <div style={{ display: "flex", gap: 32, marginBottom: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span>🔥</span>
              <span style={{ fontSize: 16 }}>0 Streak</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span>👥</span>
              <span style={{ fontSize: 16 }}>0 Votes</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span>🏆</span>
              <span style={{ fontSize: 16 }}>0% Accuracy</span>
            </div>
          </div>
          <div style={{
            border: "1px solid #374151",
            color: "white",
            padding: "12px 24px",
            borderRadius: 12,
            fontSize: 16,
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            gap: 8
          }}>
            <span>👑</span>
            View Leaderboard
          </div>
        </div>
      </div>
    ),
    { 
      width: 1200, 
      height: 800,
      headers: {
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    }
  );
}
