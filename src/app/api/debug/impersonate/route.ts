import { NextResponse } from "next/server";
import { makeSessionCookie } from "@/lib/fc-session";

export const runtime = "edge";

export async function POST(req: Request) {
  // Only allow in staging/preview environments
  if (process.env.NODE_ENV === "production" && !process.env.VERCEL_ENV?.includes("preview")) {
    return NextResponse.json({ ok: false, error: "not available in production" }, { status: 404 });
  }

  const body = await req.json().catch(() => ({}));
  const fid = String(body.fid || "");
  if (!fid) return NextResponse.json({ ok: false, error: "fid required" }, { status: 400 });

  const cookie = await makeSessionCookie(fid);
  const res = NextResponse.json({ ok: true, fid });
  res.headers.append(
    "Set-Cookie",
    `${cookie.name}=${encodeURIComponent(cookie.value)}; Path=/; Max-Age=${cookie.maxAge}; HttpOnly; Secure; SameSite=Lax`
  );
  return res;
}
