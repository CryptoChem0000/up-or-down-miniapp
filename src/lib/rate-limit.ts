import { redis, k } from "./redis";

export interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Maximum requests per window
}

export async function checkRateLimit(
  identifier: string,
  config: RateLimitConfig
): Promise<{ allowed: boolean; remaining: number; resetTime: number }> {
  const key = `rate_limit:${identifier}`;
  const now = Date.now();
  const windowStart = now - config.windowMs;
  
  // Get current count
  const currentCount = await redis.get(key) || 0;
  const count = Number(currentCount);
  
  if (count >= config.maxRequests) {
    const ttl = await redis.ttl(key);
    return {
      allowed: false,
      remaining: 0,
      resetTime: now + (ttl * 1000)
    };
  }
  
  // Increment counter
  const pipeline = redis.pipeline();
  pipeline.incr(key);
  if (count === 0) {
    pipeline.expire(key, Math.ceil(config.windowMs / 1000));
  }
  await pipeline.exec();
  
  return {
    allowed: true,
    remaining: config.maxRequests - count - 1,
    resetTime: now + config.windowMs
  };
}

// Rate limit configurations
export const RATE_LIMITS = {
  // Per FID: 5 votes per day
  fid: { windowMs: 24 * 60 * 60 * 1000, maxRequests: 5 },
  // Per IP: 100 requests per hour
  ip: { windowMs: 60 * 60 * 1000, maxRequests: 100 },
} as const;
