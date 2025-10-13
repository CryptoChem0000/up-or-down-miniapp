import { NextResponse } from "next/server";
import { getVapidPublicKey } from "@/lib/webpush";

export const runtime = "edge";

export async function GET() {
  try {
    const publicKey = getVapidPublicKey();
    
    if (!publicKey) {
      return NextResponse.json({ error: "webpush_not_configured" }, { status: 503 });
    }

    return NextResponse.json({ publicKey });
  } catch (error) {
    console.error("Error getting VAPID public key:", error);
    return NextResponse.json({ error: "internal_error" }, { status: 500 });
  }
}
