import { NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/session";
import { redis } from "@/lib/redis";

export const runtime = "edge";

interface NotificationConsent {
  mentions: boolean;
  webpush: boolean;
  email?: string;
}

export async function GET(req: Request) {
  try {
    const session = await getSessionFromRequest(req);
    if (!session) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    const consentKey = `notif:consent:${session.fid}`;
    const consentRaw = await redis.get(consentKey);
    
    let consent: NotificationConsent = {
      mentions: false,
      webpush: false
    };

    if (consentRaw && typeof consentRaw === 'string') {
      try {
        consent = { ...consent, ...JSON.parse(consentRaw) };
      } catch (parseError) {
        console.error("Error parsing notification consent:", parseError);
      }
    }

    if (process.env.DEBUG_NOTIFS === "1") {
      console.log(`🔔 GET consent for FID ${session.fid}:`, consent);
    }

    return NextResponse.json({ ok: true, consent });
  } catch (error) {
    console.error("Error getting notification consent:", error);
    return NextResponse.json({ error: "internal_error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getSessionFromRequest(req);
    if (!session) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { mentions, webpush, email } = body;

    // Validate input
    if (typeof mentions !== 'boolean' || typeof webpush !== 'boolean') {
      return NextResponse.json({ error: "invalid_input" }, { status: 400 });
    }

    const consent: NotificationConsent = {
      mentions,
      webpush,
      ...(email && typeof email === 'string' ? { email } : {})
    };

    const consentKey = `notif:consent:${session.fid}`;
    await redis.set(consentKey, JSON.stringify(consent), { ex: 60 * 60 * 24 * 365 }); // 1 year expiry

    if (process.env.DEBUG_NOTIFS === "1") {
      console.log(`🔔 SET consent for FID ${session.fid}:`, consent);
    }

    return NextResponse.json({ ok: true, consent });
  } catch (error) {
    console.error("Error setting notification consent:", error);
    return NextResponse.json({ error: "internal_error" }, { status: 500 });
  }
}
