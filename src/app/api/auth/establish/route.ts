import { NextResponse } from "next/server";
import { verifyFarcaster } from "@/lib/verify";
import { makeSessionCookie } from "@/lib/fc-session";

export const runtime = "edge";

export async function POST(req: Request) {
  // MUST be a signed Mini App / Neynar-verified request
  const verified = await verifyFarcaster(req);
  if (!verified?.ok || !verified.fid) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const cookie = await makeSessionCookie(String(verified.fid));
  const res = NextResponse.json({ ok: true, fid: String(verified.fid) });
  res.headers.append(
    "Set-Cookie",
    `${cookie.name}=${encodeURIComponent(cookie.value)}; Path=/; Max-Age=${cookie.maxAge}; HttpOnly; Secure; SameSite=Lax`
  );
  return res;
}
