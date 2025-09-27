import { redis } from "@/lib/redis";
import { fetchProfilesFromNeynar } from "./neynar";

export type Profile = {
  fid: string;
  username: string | null;
  displayName: string | null;
  avatar: string | null;
};

const TTL_SEC = 60 * 30; // 30 minutes

export async function getProfiles(fids: string[]): Promise<Record<string, Profile>> {
  if (fids.length === 0) return {};
  const unique = Array.from(new Set(fids));
  // 1) Try cache
  const cached = await redis.hmget("cache:profiles", ...unique);
  const miss: string[] = [];
  const result: Record<string, Profile> = {};

  unique.forEach((fid, i) => {
    const raw = cached?.[i];
    if (raw) {
      try {
        result[fid] = JSON.parse(raw);
      } catch {
        // Invalid JSON, treat as cache miss
        miss.push(fid);
      }
    } else {
      miss.push(fid);
    }
  });

  // 2) Fill misses
  if (miss.length) {
    const users = await fetchProfilesFromNeynar(miss);
    const pipe = redis.pipeline();
    for (const u of users) {
      const p: Profile = {
        fid: String(u.fid),
        username: u.username ?? null,
        displayName: u.display_name ?? null,
        avatar: u.pfp_url ?? null,
      };
      result[p.fid] = p;
      pipe.hset("cache:profiles", { [p.fid]: JSON.stringify(p) });
    }
    // lightweight TTL via a "touch" key (per-batch) or periodically clear cache in your cleanup cron
    pipe.expire("cache:profiles", TTL_SEC);
    await pipe.exec();
    // Ensure every miss has a record (even empty), to avoid re-query storms
    for (const fid of miss) result[fid] ??= { fid, username: null, displayName: null, avatar: null };
  }

  return result;
}
