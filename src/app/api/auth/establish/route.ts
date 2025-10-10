import { NextResponse } from "next/server";
import { verifyFarcaster } from "@/lib/verify";
import { makeSessionCookie } from "@/lib/fc-session";

export const runtime = "edge";

export async function POST(req: Request) {
  try {
    const ua = req.headers.get("user-agent") || "";
    console.log("🔐 Auth establish: User agent:", ua);
    
    // Ignore preview/screenshot bots
    if (ua.includes("vercel-screenshot") || ua.includes("Slackbot")) {
      console.log("🔐 Auth establish: Ignoring screenshot/preview bot request");
      return new NextResponse(null, { status: 204 });
    }

    console.log("🔐 Auth establish: Request headers:", Object.fromEntries(req.headers.entries()));
    console.log("🔐 Auth establish: Request method:", req.method);
    console.log("🔐 Auth establish: Request URL:", req.url);
    
    // Read request body first
    let body;
    try {
      body = await req.json();
      console.log("🔐 Auth establish: Request body:", body);
    } catch (bodyError) {
      console.log("🔐 Auth establish: No request body found:", bodyError);
      return NextResponse.json({ ok: false, error: "missing_body" }, { status: 400 });
    }

    // Try Farcaster verification first (for signed requests with signature data)
    if (body && (body.signature || body.messageHash)) {
      const verified = await verifyFarcaster(req, body);
      if (verified?.ok && verified.fid) {
        console.log("Using FID from Farcaster verification:", verified.fid);
        const cookie = await makeSessionCookie(String(verified.fid));
        const res = NextResponse.json({ ok: true, fid: String(verified.fid) });
        res.headers.append(
          "Set-Cookie",
          `${cookie.name}=${encodeURIComponent(cookie.value)}; Path=/; Max-Age=${cookie.maxAge}; HttpOnly; Secure; SameSite=None`
        );
        return res;
      }
    }

    // Try to get FID from request body (from Mini App SDK)
    const fid = body?.fid;
    if (!fid || (typeof fid !== 'string' && typeof fid !== 'number') || String(fid).length === 0) {
      console.log("❌ Auth establish: Missing or invalid FID:", fid, typeof fid);
      return NextResponse.json({ ok: false, error: "missing_fid" }, { status: 400 });
    }

    const fidString = String(fid);
    console.log("✅ Auth establish: Using FID from request body:", fidString);
    const cookie = await makeSessionCookie(fidString);
    const res = NextResponse.json({ ok: true, fid: fidString });
    res.headers.append(
      "Set-Cookie",
      `${cookie.name}=${encodeURIComponent(cookie.value)}; Path=/; Max-Age=${cookie.maxAge}; HttpOnly; Secure; SameSite=None`
    );
    return res;

  } catch (error) {
    console.error("Error in /api/auth/establish:", error);
    return NextResponse.json({ ok: false, error: "internal_error" }, { status: 500 });
  }
}
