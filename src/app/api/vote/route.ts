import { NextResponse } from "next/server";
import { VoteSchema, limitBy, limitVotesBy, limitByFid, ensureSingleVote, getClientIP, sanitizeInput } from "@/lib/guard";
import { getServerPrice } from "@/lib/prices";
import { verifyFarcaster } from "@/lib/verify";
import { redis, k } from "@/lib/redis";
import { makeSessionCookie } from "@/lib/fc-session";
import { isVotingOpen } from "@/lib/vote-window";

// export const runtime = "edge";

function isoDayUTC(ts = Date.now()) {
  return new Date(ts).toISOString().slice(0, 10);
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}

export async function POST(req: Request) {
  try {
    // Debug logging
    console.log("Vote API called");
    console.log("Headers:", Object.fromEntries(req.headers.entries()));
    
    // Check if voting window is open
    if (!isVotingOpen()) {
      const res = NextResponse.json({ error: "voting_closed" }, { status: 423 });
      res.headers.set("Access-Control-Allow-Origin", "*");
      return res;
    }

    // Rate limit by IP
    const rl = await limitBy(req);
    if (!rl.success) {
      const res = NextResponse.json({ error: "rate_limited" }, { status: 429 });
      res.headers.set("Access-Control-Allow-Origin", "*");
      return res;
    }

    // Rate limit votes by IP (5 per day)
    const voteLimit = await limitVotesBy(req);
    if (!voteLimit.success) {
      const res = NextResponse.json({ error: "daily_vote_limit_exceeded" }, { status: 429 });
      res.headers.set("Access-Control-Allow-Origin", "*");
      return res;
    }

    // Verify Farcaster signature
    const body = await req.json();
    console.log("Request body:", JSON.stringify(body, null, 2));
    
    const sanitizedBody = sanitizeInput(body);
    const verified = await verifyFarcaster(req, sanitizedBody);
    
    console.log("Verification result:", verified);
    
    if (!verified.ok) {
      const res = NextResponse.json({ error: "unauthorized", details: verified.error }, { status: 401 });
      res.headers.set("Access-Control-Allow-Origin", "*");
      return res;
    }
    
    const fid = String((verified as any).fid);

    // Rate limit by FID (10 requests per day)
    const fidLimit = await limitByFid(fid);
    if (!fidLimit.success) {
      const res = NextResponse.json({ error: "fid_rate_limited" }, { status: 429 });
      res.headers.set("Access-Control-Allow-Origin", "*");
      return res;
    }

    // Validate input
    const validatedInput = VoteSchema.parse(sanitizedBody);
    const { direction } = validatedInput;

    // Idempotent (one vote per day per FID)
    const day = isoDayUTC();
    const single = await ensureSingleVote(fid, day);
    if (!single) {
      const res = NextResponse.json({ error: "already_voted" }, { status: 409 });
      res.headers.set("Access-Control-Allow-Origin", "*");
      return res;
    }

    // Server-stamped price (cached)
    const price = await getServerPrice();

    // Persist vote with all metadata
    const voteData = {
      fid,
      direction,
      votedAt: Date.now(),
      priceUsdAtVote: price.price,
      priceTs: price.ts,
      priceSource: price.source,
      ip: await getClientIP(req),
    };

    await Promise.all([
      redis.hset(k.votes(day), { [fid]: JSON.stringify(voteData) }),
      redis.hincrby(k.counts(day), direction, 1),
      redis.sadd(`votes:${day}:fids`, fid),
    ]);

    // Create response and set session cookie
    const res = NextResponse.json({ 
      ok: true, 
      direction,
      priceAtVote: price.price,
      timestamp: price.ts 
    });
    
    // Add CORS headers for Farcaster Frames
    res.headers.set("Access-Control-Allow-Origin", "*");
    res.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
    
    // Establish session cookie after successful vote
    const cookie = await makeSessionCookie(fid);
    res.headers.append(
      "Set-Cookie",
      `${cookie.name}=${encodeURIComponent(cookie.value)}; Path=/; Max-Age=${cookie.maxAge}; HttpOnly; Secure; SameSite=Lax`
    );
    
    return res;

  } catch (error) {
    console.error("Vote API error:", error);
    
    if (error instanceof Error && error.name === "ZodError") {
      const res = NextResponse.json({ error: "invalid_input" }, { status: 400 });
      res.headers.set("Access-Control-Allow-Origin", "*");
      return res;
    }
    
    const res = NextResponse.json({ error: "internal_error" }, { status: 500 });
    res.headers.set("Access-Control-Allow-Origin", "*");
    return res;
  }
}
