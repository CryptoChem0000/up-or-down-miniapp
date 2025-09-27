import { NextRequest, NextResponse } from "next/server";
import { redis, k, todayUTC } from "@/lib/redis";
import { todaysPoll } from "@/lib/poll";
import { renderOg } from "@/ui/og";
import { checkRateLimit, RATE_LIMITS } from "@/lib/rate-limit";
import { validateNeynar } from "@/lib/neynar";
import { getServerPrice } from "@/lib/prices";

export async function GET(request: NextRequest) {
  const date = todayUTC();
  const poll = (await redis.get<ReturnType<typeof todaysPoll>>(k.poll(date))) ?? todaysPoll(date);
  const counts = (await redis.hgetall<Record<string, number>>(k.counts(date))) ?? {};
  
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta property="fc:frame" content='${JSON.stringify({
          version: "vNext",
          image: `${process.env.APP_BASE_URL}/api/results/${date}/image`,
          buttons: poll.options.map(opt => ({ label: opt, action: "post" })),
        })}' />
        <meta property="og:title" content="${poll.question}" />
        <meta property="og:image" content="${process.env.APP_BASE_URL}/api/results/${date}/image" />
      </head>
      <body>
        <img src="${process.env.APP_BASE_URL}/api/results/${date}/image" alt="Poll" />
      </body>
    </html>
  `;
  
  return new NextResponse(html, {
    headers: { "Content-Type": "text/html" },
  });
}

export async function POST(request: NextRequest) {
  const date = todayUTC();
  const poll = (await redis.get<ReturnType<typeof todaysPoll>>(k.poll(date))) ?? todaysPoll(date);
  
  try {
    // Rate limiting by IP
    const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown';
    const ipRateLimit = await checkRateLimit(`ip:${ip}`, RATE_LIMITS.ip);
    if (!ipRateLimit.allowed) {
      return new NextResponse("Rate limit exceeded", { status: 429 });
    }
    
    const formData = await request.formData();
    const choice = formData.get("choice") as "UP" | "DOWN" | null;
    const messageBytes = formData.get("messageBytes") as string | null;
    
    if (!choice || !messageBytes) {
      const html = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta property="fc:frame" content='${JSON.stringify({
              version: "vNext",
              image: `${process.env.APP_BASE_URL}/api/results/${date}/image`,
              buttons: poll.options.map(opt => ({ label: opt, action: "post" })),
            })}' />
          </head>
          <body>
            <img src="${process.env.APP_BASE_URL}/api/results/${date}/image" alt="Invalid vote" />
          </body>
        </html>
      `;
      return new NextResponse(html, { headers: { "Content-Type": "text/html" } });
    }
    
    // Validate with Neynar
    const validation = await validateNeynar(messageBytes, process.env.NEYNAR_API_KEY!);
    if (!validation.valid || !validation.fid) {
      const html = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta property="fc:frame" content='${JSON.stringify({
              version: "vNext",
              image: `${process.env.APP_BASE_URL}/api/results/${date}/image`,
              buttons: poll.options.map(opt => ({ label: opt, action: "post" })),
            })}' />
          </head>
          <body>
            <img src="${process.env.APP_BASE_URL}/api/results/${date}/image" alt="Invalid user" />
          </body>
        </html>
      `;
      return new NextResponse(html, { headers: { "Content-Type": "text/html" } });
    }
    
    const fid = validation.fid;
    
    // Rate limiting by FID
    const fidRateLimit = await checkRateLimit(`fid:${fid}`, RATE_LIMITS.fid);
    if (!fidRateLimit.allowed) {
      const html = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta property="fc:frame" content='${JSON.stringify({
              version: "vNext",
              image: `${process.env.APP_BASE_URL}/api/results/${date}/image`,
              buttons: poll.options.map(opt => ({ label: opt, action: "post" })),
            })}' />
          </head>
          <body>
            <img src="${process.env.APP_BASE_URL}/api/results/${date}/image" alt="Rate limit exceeded" />
          </body>
        </html>
      `;
      return new NextResponse(html, { headers: { "Content-Type": "text/html" } });
    }
    
    // Check if user already voted (idempotency)
    const already = await redis.hexists(k.votes(date), fid);
    if (!already) {
      // Get current price for vote stamping
      const priceData = await getServerPrice();
      const voteData = {
        choice,
        price: priceData.price,
        timestamp: Date.now()
      };
      
      await redis.hset(k.votes(date), { [fid]: JSON.stringify(voteData) });
      await redis.hincrby(k.counts(date), choice, 1);
    }
    
    const counts = (await redis.hgetall<Record<string, number>>(k.counts(date))) ?? {};
    
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta property="fc:frame" content='${JSON.stringify({
            version: "vNext",
            image: `${process.env.APP_BASE_URL}/api/results/${date}/image`,
            buttons: poll.options.map(opt => ({ label: opt, action: "post" })),
          })}' />
        </head>
        <body>
          <img src="${process.env.APP_BASE_URL}/api/results/${date}/image" alt="Vote recorded" />
        </body>
      </html>
    `;
    
    return new NextResponse(html, { headers: { "Content-Type": "text/html" } });
    
  } catch (error) {
    console.error("Frame POST error:", error);
    return new NextResponse("Error processing vote", { status: 500 });
  }
}
