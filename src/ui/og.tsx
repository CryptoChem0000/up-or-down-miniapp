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

  return new ImageResponse(
    (
      <div
        style={{
          width: 1200, 
          height: 800, 
          display: "flex", 
          flexDirection: "column",
          justifyContent: "center", 
          alignItems: "center", 
          background: "#0b0b0b",
          // Alternative: Use a custom background image
          // backgroundImage: "url('https://up-or-down-miniapp.vercel.app/your-custom-bg.png')",
          // backgroundSize: "cover",
          // backgroundPosition: "center", 
          color: "white", 
          fontFamily: "sans-serif", 
          padding: 40
        }}
      >
        {/* Add your new logo */}
        <div style={{ marginBottom: 24, display: "flex" }}>
          <img
            src="https://up-or-down-miniapp.vercel.app/icon-256.png"
            alt="Up or Down Logo"
            width={80}
            height={80}
            style={{ borderRadius: 16 }}
          />
        </div>
        <div style={{ fontSize: 56, fontWeight: 700, textAlign: "center", marginBottom: 32, display: "flex" }}>
          {question}
        </div>
        <div style={{ display: "flex", gap: 32, width: "100%", maxWidth: 1000 }}>
          {(["UP", "DOWN"] as const).map((opt) => {
            const pct = opt === "UP" ? upPct : downPct;
            const val = opt === "UP" ? up : down;
            const isH = highlight === opt;
            return (
              <div 
                key={opt} 
                style={{ 
                  display: "flex", 
                  flexDirection: "column", 
                  flex: 1, 
                  border: isH ? "4px solid #6cf" : "2px solid #333", 
                  borderRadius: 20, 
                  padding: 24 
                }}
              >
                <div style={{ fontSize: 32, opacity: 0.8, marginBottom: 8, display: "flex" }}>{opt}</div>
                <div style={{ fontSize: 96, fontWeight: 800, marginBottom: 8, display: "flex" }}>{pct}%</div>
                <div style={{ fontSize: 24, opacity: 0.6, display: "flex" }}>{val} votes</div>
              </div>
            );
          })}
        </div>
        {subtitle && (
          <div style={{ marginTop: 32, fontSize: 24, opacity: 0.8, display: "flex" }}>
            {subtitle}
          </div>
        )}
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
