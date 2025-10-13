import { NextResponse } from "next/server";
import { sendFarcasterNotification } from "@/lib/farcaster-notifications";

export const runtime = "edge";

export async function POST(req: Request) {
  try {
    // Check for admin token
    const authHeader = req.headers.get("authorization");
    const ADMIN_TOKEN = process.env.ADMIN_TOKEN;

    if (!ADMIN_TOKEN || authHeader !== `Bearer ${ADMIN_TOKEN}`) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { fid } = body;

    if (!fid) {
      return NextResponse.json({ error: "missing_fid" }, { status: 400 });
    }

    const success = await sendFarcasterNotification(fid, {
      title: "🧪 Test Farcaster Notification",
      body: "This is a test of the native Farcaster mobile push notification system!",
      targetUrl: "https://up-or-down-miniapp.vercel.app/",
      notificationId: `test-${Date.now()}-${fid}`
    });

    if (success) {
      return NextResponse.json({ 
        ok: true, 
        message: "Farcaster notification sent successfully",
        fid,
        timestamp: new Date().toISOString()
      });
    } else {
      return NextResponse.json({ 
        ok: false, 
        error: "Failed to send notification - user may not have enabled Farcaster notifications",
        fid,
        timestamp: new Date().toISOString()
      });
    }

  } catch (error) {
    console.error("Error in test Farcaster notifications endpoint:", error);
    return NextResponse.json({ 
      error: "internal_error", 
      details: error instanceof Error ? error.message : String(error) 
    }, { status: 500 });
  }
}
