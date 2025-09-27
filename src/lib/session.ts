import { verifyFarcaster } from "./verify";

export type Session = { fid: string };

export async function getSessionFromRequest(req: Request): Promise<Session | null> {
  // Use Neynar/Mini App verification here — DO NOT trust a client-provided fid
  const verified = await verifyFarcaster(req); // your existing verify function
  if (!verified.ok) return null;
  return { fid: String(verified.fid) };
}
