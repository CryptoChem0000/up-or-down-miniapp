import { NextResponse } from "next/server";
import { verifyFarcaster } from "@/lib/verify";
import { makeSessionCookie } from "@/lib/fc-session";

export const runtime = "edge";

export async function POST(req: Request) {
  try {
    // Read request body first
    let body;
    try {
      body = await req.json();
      console.log("Auth establish request body:", body);
    } catch (bodyError) {
      console.log("No request body found:", bodyError);
      // Return 401 instead of 400 for empty body - this is expected for some requests
      return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
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
          `${cookie.name}=${encodeURIComponent(cookie.value)}; Path=/; Max-Age=${cookie.maxAge}; HttpOnly; Secure; SameSite=Lax`
        );
        return res;
      }
    }

    // Try to get FID from request body (from Mini App SDK)
    if (body && typeof body.fid === 'string' && body.fid.length > 0) {
      console.log("Using FID from request body:", body.fid);
      const cookie = await makeSessionCookie(body.fid);
      const res = NextResponse.json({ ok: true, fid: body.fid });
      res.headers.append(
        "Set-Cookie",
        `${cookie.name}=${encodeURIComponent(cookie.value)}; Path=/; Max-Age=${cookie.maxAge}; HttpOnly; Secure; SameSite=Lax`
      );
      return res;
    }

    // No valid authentication found
    console.log("No valid Farcaster authentication found");
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });

  } catch (error) {
    console.error("Error in /api/auth/establish:", error);
    return NextResponse.json({ ok: false, error: "internal_error" }, { status: 500 });
  }
}
