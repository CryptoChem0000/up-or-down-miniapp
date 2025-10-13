import { NextResponse } from "next/server";
import { sendPushNotification } from "@/lib/webpush";

export const runtime = "edge";

export async function POST(req: Request) {
  try {
    // Admin endpoint - check for admin token
    const authHeader = req.headers.get("authorization");
    const adminToken = process.env.ADMIN_TOKEN;
    
    if (!adminToken || authHeader !== `Bearer ${adminToken}`) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { fid, title, body: messageBody, url } = body;

    if (!fid || !title || !messageBody) {
      return NextResponse.json({ error: "missing_required_fields" }, { status: 400 });
    }

    await sendPushNotification(fid, {
      title,
      body: messageBody,
      url: url || '/'
    });

    if (process.env.DEBUG_NOTIFS === "1") {
      console.log(`🔔 Admin push sent to FID ${fid}:`, title);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error sending push notification:", error);
    return NextResponse.json({ error: "internal_error" }, { status: 500 });
  }
}
