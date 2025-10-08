import { z } from "zod";
import { Ratelimit } from "@upstash/ratelimit";
import { redis } from "@/lib/redis";

export const VoteSchema = z.object({ 
  direction: z.enum(["up", "down"]),
  fid: z.string().optional() // FID will be verified server-side
});

export const rateLimit = new Ratelimit({
  redis, 
  limiter: Ratelimit.slidingWindow(20, "1 m"),
});

export const voteRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(20, "1 d"), // 20 votes per day per IP (more generous for testing)
});

export async function limitBy(req: Request) {
  const ip = req.headers.get("x-forwarded-for") ?? 
             req.headers.get("x-real-ip") ?? 
             "ip:unknown";
  return rateLimit.limit(`vote:${ip}`);
}

export async function limitVotesBy(req: Request) {
  const ip = req.headers.get("x-forwarded-for") ?? 
             req.headers.get("x-real-ip") ?? 
             "ip:unknown";
  return voteRateLimit.limit(`vote:${ip}`);
}

export async function limitByFid(fid: string) {
  const fidRateLimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(50, "1 d"), // 50 requests per day per FID (more generous)
  });
  return fidRateLimit.limit(`fid:${fid}`);
}

// Idempotency key (one vote per fid per day)
export async function ensureSingleVote(fid: string, isoDay: string): Promise<boolean> {
  const key = `lock:vote:${isoDay}:${fid}`;
  // 26h expiry to cover time drift
  const ok = await redis.set(key, "1", { nx: true, ex: 60 * 60 * 26 });
  return !!ok; // false if already voted
}

export async function getClientIP(req: Request): Promise<string> {
  const forwarded = req.headers.get("x-forwarded-for");
  const realIP = req.headers.get("x-real-ip");
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  if (realIP) {
    return realIP;
  }
  
  return "unknown";
}

export function sanitizeInput(input: unknown): unknown {
  if (typeof input === 'string') {
    // Basic sanitization - remove potential XSS
    return input.replace(/[<>\"']/g, '');
  }
  
  if (Array.isArray(input)) {
    return input.map(sanitizeInput);
  }
  
  if (typeof input === 'object' && input !== null) {
    const sanitized: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(input)) {
      sanitized[key] = sanitizeInput(value);
    }
    return sanitized;
  }
  
  return input;
}
