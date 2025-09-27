import { verifyFarcaster } from "./verify";
import { getCookieFromHeader, readSessionCookie, COOKIE_NAME_FC } from "./fc-session";

export type Session = { fid: string };

export async function getSessionFromRequest(req: Request): Promise<Session | null> {
  // 1) Try signed cookie (set by /api/auth/establish)
  const raw = getCookieFromHeader(req.headers.get("cookie"), COOKIE_NAME_FC);
  const sess = await readSessionCookie(raw);
  if (sess?.fid) return { fid: sess.fid };

  // 2) Fallback to live Farcaster verification (for signed Mini App requests)
  const verified = await verifyFarcaster(req);
  if (!verified?.ok || !verified.fid) return null;
  return { fid: String(verified.fid) };
}
