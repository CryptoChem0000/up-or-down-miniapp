// Minimal signed cookie for Farcaster fid
const COOKIE_NAME = "fc_sess";
const MAX_AGE_SEC = 60 * 60 * 24 * 7; // 7 days

async function hmac(payload: string, secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));
  return Array.from(new Uint8Array(signature))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function makeSessionCookie(fid: string) {
  const secret = process.env.ADMIN_TOKEN!; // any server secret
  const payload = String(fid);
  const sig = await hmac(payload, secret);
  const value = `${payload}.${sig}`;
  return { name: COOKIE_NAME, value, maxAge: MAX_AGE_SEC };
}

export async function readSessionCookie(raw?: string | null): Promise<{ fid: string } | null> {
  if (!raw) return null;
  const secret = process.env.ADMIN_TOKEN!;
  const [payload, sig] = raw.split(".");
  if (!payload || !sig) return null;
  const expectedSig = await hmac(payload, secret);
  const ok = expectedSig === sig;
  return ok ? { fid: payload } : null;
}

export function getCookieFromHeader(h: string | null, name = COOKIE_NAME) {
  if (!h) return null;
  const parts = h.split(/; */);
  for (const p of parts) {
    const [k, v] = p.split("=");
    if (k?.trim() === name) return decodeURIComponent(v || "");
  }
  return null;
}

export const COOKIE_NAME_FC = COOKIE_NAME;
