import { NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/session";
import { postMentionCast } from "@/lib/farcaster";
import { sendPushNotification } from "@/lib/webpush";

export const runtime = "edge";

export async function POST(req: Request) {
  try {
    // Check for admin token
    const authHeader = req.headers.get("authorization");
    const adminToken = process.env.ADMIN_TOKEN;
    
    if (!adminToken || authHeader !== `Bearer ${adminToken}`) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { fid, type } = body;

    if (!fid || !type) {
      return NextResponse.json({ error: "missing_required_fields" }, { status: 400 });
    }

    const baseUrl = process.env.APP_BASE_URL || "https://up-or-down-miniapp.vercel.app";

    if (type === "mention") {
      await postMentionCast({
        toFid: fid,
        text: "🧪 Test mention from ETH Daily Poll!",
        url: `${baseUrl}/launch`
      });
    } else if (type === "push") {
      await sendPushNotification(fid, {
        title: "🧪 Test Push Notification",
        body: "This is a test notification from ETH Daily Poll!",
        url: `${baseUrl}/launch`
      });
    } else {
      return NextResponse.json({ error: "invalid_type" }, { status: 400 });
    }

    if (process.env.DEBUG_NOTIFS === "1") {
      console.log(`🔔 Test ${type} sent to FID ${fid}`);
    }

    return NextResponse.json({ ok: true, type, fid });
  } catch (error) {
    console.error("Error sending test notification:", error);
    return NextResponse.json({ error: "internal_error" }, { status: 500 });
  }
}
