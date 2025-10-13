import { NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/session";
import { redis } from "@/lib/redis";

export const runtime = "edge";

export async function POST(req: Request) {
  try {
    const session = await getSessionFromRequest(req);
    if (!session) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { subscription } = body;

    if (!subscription || typeof subscription !== 'object') {
      return NextResponse.json({ error: "invalid_subscription" }, { status: 400 });
    }

    const subscriptionStr = JSON.stringify(subscription);
    const pushKey = `push:subs:${session.fid}`;

    // Add subscription to user's set
    await redis.sadd(pushKey, subscriptionStr);

    if (process.env.DEBUG_NOTIFS === "1") {
      console.log(`🔔 Added push subscription for FID ${session.fid}`);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error subscribing to push notifications:", error);
    return NextResponse.json({ error: "internal_error" }, { status: 500 });
  }
}
