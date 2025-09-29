import { NextResponse } from "next/server";

export async function GET() {
  const base = process.env.APP_BASE_URL!;
  return NextResponse.json({
    accountAssociation: {
      header: "", payload: "", signature: ""
    },
    miniapp: {
      version: "1",
      name: "ETH Daily",
      iconUrl: `${base}/icon-1024.png`,
      homeUrl: `${base}/`,
      imageUrl: `${base}/api/results/today/image`,
      buttonTitle: "🚀 Start",
      splashImageUrl: `${base}/splash-200.png`,
      splashBackgroundColor: "#0b0b0b"
    },
  });
}
