import { NextResponse } from "next/server";
import { verifyFarcaster } from "@/lib/verify";
import { makeSessionCookie } from "@/lib/fc-session";

export const runtime = "edge";

export async function POST(req: Request) {
  try {
    // Try Farcaster verification first (for signed requests)
    const verified = await verifyFarcaster(req);
    if (verified?.ok && verified.fid) {
      const cookie = await makeSessionCookie(String(verified.fid));
      const res = NextResponse.json({ ok: true, fid: String(verified.fid) });
      res.headers.append(
        "Set-Cookie",
        `${cookie.name}=${encodeURIComponent(cookie.value)}; Path=/; Max-Age=${cookie.maxAge}; HttpOnly; Secure; SameSite=Lax`
      );
      return res;
    }

    // For Mini App context without signatures, create a mock session for testing
    // In production, this should use the Farcaster Mini App SDK to get the real FID
    console.log("No Farcaster signature found, creating mock session for Mini App testing");
    
    // Use a mock FID for testing (this should be replaced with real FID from SDK)
    const mockFid = "12345"; // This matches the mock FID in the manifest
    
    const cookie = await makeSessionCookie(mockFid);
    const res = NextResponse.json({ ok: true, fid: mockFid, mock: true });
    res.headers.append(
      "Set-Cookie",
      `${cookie.name}=${encodeURIComponent(cookie.value)}; Path=/; Max-Age=${cookie.maxAge}; HttpOnly; Secure; SameSite=Lax`
    );
    return res;

  } catch (error) {
    console.error("Error in /api/auth/establish:", error);
    return NextResponse.json({ ok: false, error: "internal_error" }, { status: 500 });
  }
}
