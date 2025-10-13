import { NextResponse } from "next/server";
import { redis } from "@/lib/redis";

export const runtime = "edge";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { type, data } = body;

    console.log("🔔 Farcaster webhook received:", { type, data });

    if (type === 'notifications_enabled') {
      const { token, url, fid } = data;
      
      if (!token || !url || !fid) {
        console.error("Missing required fields in notifications_enabled event:", data);
        return NextResponse.json({ error: "missing_fields" }, { status: 400 });
      }

      // Store the notification token and URL for this user
      const notificationKey = `farcaster:notification:${fid}`;
      const notificationData = {
        token,
        url,
        enabledAt: new Date().toISOString(),
        fid
      };

      await redis.set(notificationKey, JSON.stringify(notificationData), { ex: 60 * 60 * 24 * 365 }); // 1 year expiry

      console.log(`🔔 Stored Farcaster notification token for FID ${fid}`);
      
      return NextResponse.json({ ok: true, message: "Notification token stored" });
    }

    if (type === 'notifications_disabled') {
      const { fid } = data;
      
      if (!fid) {
        console.error("Missing FID in notifications_disabled event:", data);
        return NextResponse.json({ error: "missing_fid" }, { status: 400 });
      }

      // Remove the notification token for this user
      const notificationKey = `farcaster:notification:${fid}`;
      await redis.del(notificationKey);

      console.log(`🔔 Removed Farcaster notification token for FID ${fid}`);
      
      return NextResponse.json({ ok: true, message: "Notification token removed" });
    }

    console.log("🔔 Unhandled webhook event type:", type);
    return NextResponse.json({ ok: true, message: "Event received" });

  } catch (error) {
    console.error("Error processing Farcaster webhook:", error);
    return NextResponse.json({ error: "internal_error" }, { status: 500 });
  }
}
