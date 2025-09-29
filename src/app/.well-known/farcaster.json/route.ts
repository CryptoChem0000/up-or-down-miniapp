import { NextResponse } from "next/server";

const baseUrl = process.env.APP_BASE_URL || "https://up-or-down-miniapp.vercel.app";

export async function GET() {
  const manifest = {
    accountAssociation: {
      header: "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9",
      payload: "eyJpc3MiOiJodHRwczovL2ZhcmNhc3Rlci5kZXYiLCJhdWQiOiJodHRwczovL2ZhcmNhc3Rlci5kZXYiLCJleHAiOjE3MzU0NDQ4MDAsImlhdCI6MTczNTQ0MTIwMCwibmJmIjoxNzM1NDQxMjAwLCJzdWIiOiIxMjM0NSIsImRhdGEiOnsiZmlkIjoiMTIzNDUifX0=",
      signature: "mock_signature_for_development"
    },
    miniapp: {
      version: "1",
      name: "Up or Down",
      iconUrl: `${baseUrl}/icon-1024.png`,
      homeUrl: baseUrl,
      splashImageUrl: `${baseUrl}/splash.png`,
      splashBackgroundColor: "#0b0b0b",
      webhookUrl: `${baseUrl}/api/webhook`,
      subtitle: "Build your streak. Compete with others.",
      description: "Make a daily prediction on whether the price of ETH will go up or down. Earn points and build your streak to gain multipliers.",
      primaryCategory: "games",
      heroImageUrl: `${baseUrl}/hero.png`,
      tags: ["prediction", "community", "ethereum", "daily", "eth"],
      tagline: "Build your streak and compete.",
      ogTitle: "Up or Down - ETH Prediction",
      ogDescription: "Predict ETH price movement, build your streak, earn points.",
      ogImageUrl: `${baseUrl}/icon-1024.png`,
      screenshotUrls: [`${baseUrl}/up-or-down.png`]
    }
  };

  return NextResponse.json(manifest, {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
