import { NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/session";
import { getProfiles } from "@/lib/profile-cache";

export const runtime = "edge";

export async function GET(req: Request) {
  const sess = await getSessionFromRequest(req);
  if (!sess) return NextResponse.json({ ok: false }, { status: 401 });

  const map = await getProfiles([sess.fid]);
  const p = map[sess.fid];
  return NextResponse.json({
    ok: true,
    fid: sess.fid,
    username: p?.username,
    displayName: p?.displayName,
    avatar: p?.avatar,
  });
}
