import { NextResponse } from "next/server";

export async function GET() {
  const base = process.env.APP_BASE_URL!;
  return NextResponse.json({
    accountAssociation: {
      header: "", payload: "", signature: ""
    },
    frame: {
      version: "1",
      name: "Daily One-Tap Poll",
      homeUrl: `${base}/`,
      iconUrl: `${base}/icon-1024.png`,
      splashImageUrl: `${base}/splash-200.png`,
      splashBackgroundColor: "#0b0b0b",
      subtitle: "Predict ETH daily. Win streak multipliers.",
      description: "A simple daily UP/DOWN ETH poll with streak points.",
    },
  });
}
