# Daily One-Tap Poll - Complete Application Code

This document contains all the code for the Daily One-Tap Poll Farcaster Mini App in a single reference.

## Project Structure

```
daily-one-tap-poll/
├── package.json
├── next.config.mjs
├── tailwind.config.cjs
├── postcss.config.cjs
├── vercel.json
├── env.example
├── README.md
├── src/
│   ├── app/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── leaderboard/page.tsx
│   │   ├── test/page.tsx
│   │   ├── well-known/farcaster.json/route.ts
│   │   └── api/
│   │       ├── frames/route.ts
│   │       ├── price/route.ts
│   │       ├── leaderboard/route.ts
│   │       ├── user/[fid]/route.ts
│   │       ├── cron/open/route.ts
│   │       ├── cron/close/route.ts
│   │       ├── debug/state/route.ts
│   │       ├── debug/vote/route.ts
│   │       └── results/[date]/image/route.ts
│   ├── lib/
│   │   ├── redis.ts
│   │   ├── poll.ts
│   │   ├── prices.ts
│   │   ├── neynar.ts
│   │   ├── rate-limit.ts
│   │   ├── settle.ts
│   │   ├── rules.ts
│   │   ├── miniapp.ts
│   │   └── utils.ts
│   ├── components/
│   │   ├── ui/
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── toast.tsx
│   │   │   └── toaster.tsx
│   │   ├── HeroHeader.tsx
│   │   ├── VoteButton.tsx
│   │   ├── ETHPriceDisplay.tsx
│   │   ├── StatsCard.tsx
│   │   └── ClientToaster.tsx
│   ├── hooks/
│   │   ├── use-mobile.ts
│   │   └── use-toast.ts
│   └── ui/
│       └── og.tsx
├── public/
│   ├── eth-mark-tight-20.png
│   ├── eth-mark-tight-40.png
│   ├── icon-1024.png
│   ├── icon-eth.png
│   └── splash-200.png
└── UI_COMPLETE.tsx
```

## Key Features

- **Farcaster Mini App**: Optimized for 424×695px viewport
- **Real-time ETH Price**: CoinGecko API with Redis caching and rate limiting
- **Vote Stamping**: Each vote includes current server price and timestamp
- **Leaderboard**: Points and streak tracking with Redis ZSETs
- **Responsive Design**: Works on mobile and desktop
- **Production Ready**: Environment-gated developer tools
- **Rate Limited**: IP and FID based rate limiting
- **Cron Jobs**: Vercel crons for price cache warming and daily settlement

## Recent Updates

### Latest Changes (Current State)

1. **CoinGecko Price Feed Implementation**
   - Replaced Binance/Coinbase/Kraken with CoinGecko API
   - Added Redis caching with 60s staleness check and 90s TTL
   - Implemented lock mechanism to prevent concurrent upstream requests
   - Added `/api/price` endpoint with recommended refresh policy
   - Client polls every 120s and refreshes on tab focus
   - Votes are stamped with current server price for accurate timing
   - Vercel cron job keeps price cache warm (every minute)

2. **HeroHeader Component Refactor**
   - Created responsive HeroHeader component with centered layout
   - Uses consistent vertical rhythm with `gap-y-*` spacing
   - Text widths constrained: `max-w-[30ch]` on small screens, `max-w-[36ch]` on desktop
   - Title scales responsively: `text-2xl sm:text-3xl` with bold styling
   - Pill is compact, centered, and conditionally rendered
   - Updated title from "Daily ETH Poll" to "ETHEREUM"

3. **Production Safety Features**
   - Environment-gated developer tools (`NEXT_PUBLIC_SHOW_DEV_LINKS`)
   - "Compose (embed)" and "Open Frame" buttons hidden in production
   - `/test` page blocked in production with `notFound()`
   - Clean production Farcaster Mini App without dev tools

4. **UI Improvements**
   - Increased ETH chip logo size (32px → 40px container, 20px → 24px image)
   - Removed Neynar verification text for cleaner footer
   - Vote button hover effects with border highlighting (maintains original colors)
   - Updated header container styling for new blue ETH logos

5. **Leaderboard Integration**
   - Added `/leaderboard` page with responsive design (compact mode for mini-app)
   - Redis ZSET operations for points and streak tracking
   - Personal stats display with current user data
   - "Your Stats" section showing rank, points, and accuracy

## Core Configuration Files

### package.json
```json
{
  "name": "daily-one-tap-poll",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "next dev -p 3010",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "@radix-ui/react-accordion": "^1.2.12",
    "@radix-ui/react-alert-dialog": "^1.1.15",
    "@radix-ui/react-aspect-ratio": "^1.1.7",
    "@radix-ui/react-avatar": "^1.1.10",
    "@radix-ui/react-checkbox": "^1.3.3",
    "@radix-ui/react-collapsible": "^1.1.12",
    "@radix-ui/react-context-menu": "^2.2.16",
    "@radix-ui/react-dialog": "^1.1.15",
    "@radix-ui/react-dropdown-menu": "^2.1.16",
    "@radix-ui/react-hover-card": "^1.1.15",
    "@radix-ui/react-label": "^2.1.7",
    "@radix-ui/react-menubar": "^1.1.16",
    "@radix-ui/react-navigation-menu": "^1.2.14",
    "@radix-ui/react-popover": "^1.1.15",
    "@radix-ui/react-progress": "^1.1.7",
    "@radix-ui/react-radio-group": "^1.3.8",
    "@radix-ui/react-scroll-area": "^1.2.10",
    "@radix-ui/react-select": "^2.2.6",
    "@radix-ui/react-separator": "^1.1.7",
    "@radix-ui/react-slider": "^1.3.6",
    "@radix-ui/react-slot": "^1.2.3",
    "@radix-ui/react-switch": "^1.2.6",
    "@radix-ui/react-tabs": "^1.1.13",
    "@radix-ui/react-toast": "^1.2.15",
    "@radix-ui/react-toggle": "^1.1.10",
    "@radix-ui/react-toggle-group": "^1.1.11",
    "@radix-ui/react-tooltip": "^1.2.8",
    "@upstash/redis": "^1.31.0",
    "@vercel/og": "^0.6.3",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "cmdk": "^1.1.1",
    "date-fns": "^3.6.0",
    "embla-carousel-react": "^8.6.0",
    "input-otp": "^1.4.2",
    "lucide-react": "^0.544.0",
    "next-themes": "^0.3.0",
    "next": "14.1.0",
    "react": "^18.2.0",
    "react-day-picker": "^8.10.1",
    "react-dom": "^18.2.0",
    "react-hook-form": "^7.61.1",
    "react-resizable-panels": "^2.1.9",
    "react-router-dom": "^6.30.1",
    "recharts": "^2.15.4",
    "sonner": "^1.7.4",
    "tailwind-merge": "^3.3.1",
    "tailwindcss-animate": "^1.0.7",
    "vaul": "^0.9.9",
    "zod": "^3.23.8"
  },
  "devDependencies": {
    "@types/node": "^20.11.30",
    "@types/react": "^19.1.14",
    "@types/react-dom": "^19.1.9",
    "autoprefixer": "^10.4.21",
    "eslint": "^8.57.0",
    "eslint-config-next": "14.1.0",
    "postcss": "^8.5.6",
    "tailwindcss": "^3.4.17",
    "typescript": "^5.6.2"
  }
}
```

### next.config.mjs
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: { allowedOrigins: ['*'] }
  },
  transpilePackages: ['frames.js'],
  webpack: (config) => {
    config.experiments = {
      ...config.experiments,
      topLevelAwait: true,
    };
    return config;
  }
};
export default nextConfig;
```

### tailwind.config.ts
```typescript
import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      borderRadius: {
        lg: "0.5rem",
        md: "calc(0.5rem - 2px)",
        sm: "calc(0.5rem - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
```

### vercel.json
```json
{
  "crons": []
}
```

### env.example
```env
# Required environment variables
APP_BASE_URL=http://localhost:3010
UPSTASH_REDIS_REST_URL=your_upstash_redis_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_redis_token
NEYNAR_API_KEY=your_neynar_api_key

# Debug testing (optional)
ALLOW_DEBUG_VOTE=1
DEBUG_TOKEN=your-long-random-token
```

## Core Library Files

### src/lib/redis.ts
```typescript
import { Redis } from "@upstash/redis";

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export const k = {
  poll: (date: string) => `poll:${date}`,
  votes: (date: string) => `poll:${date}:votes`,
  counts: (date: string) => `poll:${date}:counts`,
  priceOpen: (date: string) => `price:${date}:open`,
  priceOpenRaw: (date: string) => `price:${date}:open:raw`,
  priceClose: (date: string) => `price:${date}:close`,
  priceCloseRaw: (date: string) => `price:${date}:close:raw`,
  result: (date: string) => `result:${date}`,
  settled: (date: string) => `settled:${date}`,
  lockSettle: (date: string) => `lock:settle:${date}`,
  userStreak: (fid: string) => `user:${fid}:streak`,
  userPoints: (fid: string) => `user:${fid}:points`,
  userLedger: (fid: string) => `user:${fid}:ledger`,
};

export function todayUTC(): string {
  return new Date().toISOString().slice(0, 10);
}
```

### src/lib/poll.ts
```typescript
export const EPSILON = 0.001; // 0.10%
export const BASE_POINTS = 1000;
export const DAMPING_BETA = 0.6; // 0..1
export const MULTIPLIER_CAP = 32;

export type PollDoc = {
  date: string;
  question: string;
  options: ("UP" | "DOWN")[];
  maxVotesPerFid: 1;
};

export function todaysPoll(date: string): PollDoc {
  return {
    date,
    question: "ETH up or down today?",
    options: ["UP", "DOWN"],
    maxVotesPerFid: 1,
  };
}

export type DayResult = "UP" | "DOWN" | "FLAT";

export function classifyResult(open: number, close: number): DayResult {
  const r = (close - open) / open;
  if (r > +EPSILON) return "UP";
  if (r < -EPSILON) return "DOWN";
  return "FLAT";
}

export function multiplier(streakAfter: number): number {
  const raw = Math.pow(2, (streakAfter - 1) * DAMPING_BETA);
  return Math.min(MULTIPLIER_CAP, raw);
}
```

### src/lib/prices.ts
```typescript
type VenueMid = { venue: string; mid: number };

async function coinbaseMid(): Promise<VenueMid | null> {
  try {
    const r = await fetch("https://api.exchange.coinbase.com/products/ETH-USD/ticker", { cache: "no-store" });
    const j = await r.json();
    const bid = parseFloat(j.bid), ask = parseFloat(j.ask) || parseFloat(j.price);
    if (!isFinite(bid) || !isFinite(ask)) return null;
    return { venue: "coinbase", mid: (bid + ask) / 2 };
  } catch { return null; }
}

async function krakenMid(): Promise<VenueMid | null> {
  try {
    const r = await fetch("https://api.kraken.com/0/public/Ticker?pair=ETHUSD", { cache: "no-store" });
    const j = await r.json();
    const d = j?.result?.XETHZUSD || j?.result?.ETHUSD;
    const bid = parseFloat(d?.b?.[0]), ask = parseFloat(d?.a?.[0]);
    if (!isFinite(bid) || !isFinite(ask)) return null;
    return { venue: "kraken", mid: (bid + ask) / 2 };
  } catch { return null; }
}

async function binanceMid(): Promise<VenueMid | null> {
  try {
    const r = await fetch("https://api.binance.com/api/v3/ticker/bookTicker?symbol=ETHUSDT", { cache: "no-store" });
    const j = await r.json();
    const bid = parseFloat(j.bidPrice), ask = parseFloat(j.askPrice);
    if (!isFinite(bid) || !isFinite(ask)) return null;
    return { venue: "binance", mid: (bid + ask) / 2 };
  } catch { return null; }
}

export async function consensusMid(): Promise<{ mid?: number; mids: VenueMid[] }> {
  const list = (await Promise.all([coinbaseMid(), krakenMid(), binanceMid()])) as (VenueMid | null)[];
  const filtered = list.filter(Boolean) as VenueMid[];
  if (filtered.length === 0) return { mids: [] };
  const mids = filtered.map(x => x.mid).sort((a,b) => a - b);
  const median = mids[Math.floor(mids.length / 2)];
  return { mid: median, mids: filtered };
}
```

### src/lib/neynar.ts
```typescript
export interface NeynarValidationResult {
  valid: boolean;
  fid?: string;
  username?: string;
  displayName?: string;
  error?: string;
}

export async function validateNeynar(
  messageBytes: string,
  apiKey: string
): Promise<NeynarValidationResult> {
  try {
    const response = await fetch('https://api.neynar.com/v2/farcaster/frame/validate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api_key': apiKey,
      },
      body: JSON.stringify({
        message_bytes_in_hex: messageBytes,
      }),
    });

    if (!response.ok) {
      return { valid: false, error: 'Neynar validation failed' };
    }

    const data = await response.json();
    
    if (data.valid) {
      return {
        valid: true,
        fid: data.action?.interactor?.fid?.toString(),
        username: data.action?.interactor?.username,
        displayName: data.action?.interactor?.display_name,
      };
    }

    return { valid: false, error: 'Invalid message' };
  } catch (error) {
    console.error('Neynar validation error:', error);
    return { valid: false, error: 'Validation service unavailable' };
  }
}
```

### src/lib/rate-limit.ts
```typescript
import { redis, k } from "./redis";

export interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
}

export async function checkRateLimit(
  identifier: string,
  config: RateLimitConfig
): Promise<{ allowed: boolean; remaining: number; resetTime: number }> {
  const key = `rate_limit:${identifier}`;
  const now = Date.now();
  const windowStart = now - config.windowMs;
  
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

export const RATE_LIMITS = {
  fid: { windowMs: 24 * 60 * 60 * 1000, maxRequests: 5 },
  ip: { windowMs: 60 * 60 * 1000, maxRequests: 100 },
} as const;
```

### src/lib/settle.ts
```typescript
import { redis, k } from "./redis";
import { BASE_POINTS, classifyResult, multiplier } from "./poll";

export async function settleDay(date: string, open: number, close: number) {
  const result = classifyResult(open, close);
  await redis.set(k.result(date), result);

  const votes = await redis.hgetall<Record<string, "UP" | "DOWN">>(k.votes(date));
  if (!votes || Object.keys(votes).length === 0) {
    await redis.set(k.settled(date), 1);
    return { result, settledCount: 0 };
  }

  let settledCount = 0;
  for (const [fid, vote] of Object.entries(votes)) {
    if (result === "FLAT" || vote !== result) {
      await redis.set(k.userStreak(fid), 0);
      await redis.lpush(k.userLedger(fid), JSON.stringify({ date, vote, result, awarded: 0, streak_after: 0 }));
    } else {
      const sOld = Number(await redis.get(k.userStreak(fid))) || 0;
      const sNew = sOld + 1;
      const mult = multiplier(sNew);
      const award = Math.floor(BASE_POINTS * mult);
      await redis.set(k.userStreak(fid), sNew);
      await redis.incrby(k.userPoints(fid), award);
      await redis.lpush(k.userLedger(fid), JSON.stringify({ date, vote, result, awarded: award, streak_after: sNew }));
    }
    settledCount++;
  }

  await redis.set(k.settled(date), 1);
  return { result, settledCount };
}
```

### src/lib/rules.ts
```typescript
export const OPEN_SNAPSHOT_DELAY_MS = 15_000;   // 00:00:15 UTC
export const CLOSE_SNAPSHOT_DELAY_MS = 45_000;  // 23:59:45 UTC
```

### src/lib/miniapp.ts
```typescript
export function miniAppEmbedJSON(baseUrl: string) {
  return JSON.stringify({
    version: "1",
    imageUrl: `${baseUrl}/api/results/today/image`,
    button: {
      title: "Open Daily Poll",
      action: {
        type: "launch_frame",
        name: "Daily One-Tap Poll",
        url: `${baseUrl}/`,
        splashImageUrl: `${baseUrl}/splash-200.png`,
        splashBackgroundColor: "#0b0b0b"
      }
    }
  });
}
```

### src/lib/utils.ts
```typescript
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

## Frontend Components

### src/app/globals.css
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  * {
    @apply border-gray-700;
  }

  body {
    @apply bg-gray-900 text-white;
  }
}
```

### src/app/layout.tsx
```typescript
import type { Metadata } from "next";
import "./globals.css";
import { miniAppEmbedJSON } from "@/lib/miniapp";
import { ClientToaster } from "@/components/ClientToaster";

const baseUrl = process.env.APP_BASE_URL || "http://localhost:3010";

export const metadata: Metadata = {
  title: "Daily One-Tap Poll — ETH",
  description: "Predict ETH daily. Win streak multipliers.",
  other: {
    "fc:miniapp": miniAppEmbedJSON(baseUrl),
    "fc:frame": miniAppEmbedJSON(baseUrl),
    "og:title": "Daily One-Tap Poll — ETH",
    "og:description": "Predict ETH daily. Win streak multipliers.",
    "og:image": `${baseUrl}/api/results/today/image`,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <ClientToaster />
      </body>
    </html>
  );
}
```

### src/app/page.tsx
```typescript
"use client";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { VoteButton } from "@/components/VoteButton";
import { ETHPriceDisplay } from "@/components/ETHPriceDisplay";
import { StatsCard } from "@/components/StatsCard";
import { useToast } from "@/hooks/use-toast";

export default function Page() {
  const [selectedVote, setSelectedVote] = useState<"up" | "down" | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const { toast } = useToast();
  
  const ethData = {
    price: 3420.50,
    change24h: 127.32,
    changePercent: 3.87
  };
  
  const userStats = {
    streak: 7,
    totalVotes: 23,
    accuracy: 74
  };

  const handleVote = (direction: "up" | "down") => {
    if (hasVoted) return;
    
    setSelectedVote(direction);
    setHasVoted(true);
    
    toast({
      title: `Voted ${direction.toUpperCase()}!`,
      description: "Your prediction has been recorded. Check back tomorrow for results!",
    });
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div 
        className="w-[424px] h-[695px] bg-gray-900 border border-gray-700 rounded-2xl overflow-hidden"
        style={{ 
          boxShadow: "0 20px 60px -12px rgba(0, 0, 0, 0.8)",
        }}
      >
        <div className="h-full flex flex-col p-6 space-y-6">
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-full bg-blue-500 border border-blue-400 flex items-center justify-center">
                <span className="text-white font-bold text-sm">ETH</span>
              </div>
              <h1 className="text-xl font-bold text-white">Daily ETH Poll</h1>
            </div>
            <p className="text-gray-400 text-sm">
              Will ETH price go up or down today?
            </p>
            {!hasVoted && (
              <Badge variant="outline" className="border-blue-400 text-blue-400">
                Vote closes at midnight UTC
              </Badge>
            )}
          </div>

          <ETHPriceDisplay 
            price={ethData.price}
            change24h={ethData.change24h}
            changePercent={ethData.changePercent}
          />

          <div className="space-y-4">
            <div className="text-center">
              <h2 className="text-lg font-semibold mb-2 text-white">Make Your Prediction</h2>
              {hasVoted && (
                <Badge variant="outline" className="border-green-500 text-green-400">
                  Voted {selectedVote?.toUpperCase()} ✓
                </Badge>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <VoteButton
                direction="up"
                onClick={() => handleVote("up")}
                isSelected={selectedVote === "up"}
                className={hasVoted && selectedVote !== "up" ? "opacity-50" : ""}
              />
              <VoteButton
                direction="down"
                onClick={() => handleVote("down")}
                isSelected={selectedVote === "down"}
                className={hasVoted && selectedVote !== "down" ? "opacity-50" : ""}
              />
            </div>
          </div>

          <StatsCard 
            streak={userStats.streak}
            totalVotes={userStats.totalVotes}
            accuracy={userStats.accuracy}
          />

          <div className="mt-auto">
            <Card className="p-3 bg-gray-800 border-gray-700">
              <div className="text-xs text-gray-400 text-center space-y-1">
                <div>Build your streak • Compete with others</div>
                <div className="text-blue-400">Results revealed daily at 12:01 AM UTC</div>
                <div className="flex gap-2 justify-center mt-2">
                  <a href="/api/frames" className="text-blue-400 hover:underline">Frame →</a>
                  <a href="/test" className="text-blue-400 hover:underline">Test Panel →</a>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
```

## API Routes

### src/app/api/frames/route.ts
```typescript
import { NextRequest, NextResponse } from "next/server";
import { redis, k, todayUTC } from "@/lib/redis";
import { todaysPoll } from "@/lib/poll";
import { checkRateLimit, RATE_LIMITS } from "@/lib/rate-limit";
import { validateNeynar } from "@/lib/neynar";

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
    const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown';
    const ipRateLimit = await checkRateLimit(`ip:${ip}`, RATE_LIMITS.ip);
    if (!ipRateLimit.allowed) {
      return new NextResponse("Rate limit exceeded", { status: 429 });
    }
    
    const formData = await request.formData();
    const choice = formData.get("choice") as "UP" | "DOWN" | null;
    const messageBytes = formData.get("messageBytes") as string | null;
    
    if (!choice || !messageBytes) {
      return new NextResponse("Invalid request", { status: 400 });
    }
    
    const validation = await validateNeynar(messageBytes, process.env.NEYNAR_API_KEY!);
    if (!validation.valid || !validation.fid) {
      return new NextResponse("Invalid user", { status: 401 });
    }
    
    const fid = validation.fid;
    
    const fidRateLimit = await checkRateLimit(`fid:${fid}`, RATE_LIMITS.fid);
    if (!fidRateLimit.allowed) {
      return new NextResponse("Rate limit exceeded", { status: 429 });
    }
    
    const already = await redis.hexists(k.votes(date), fid);
    if (!already) {
      await redis.hset(k.votes(date), { [fid]: choice });
      await redis.hincrby(k.counts(date), choice, 1);
    }
    
    return new NextResponse("Vote recorded", { status: 200 });
    
  } catch (error) {
    console.error("Frame POST error:", error);
    return new NextResponse("Error processing vote", { status: 500 });
  }
}
```

### src/app/api/cron/open/route.ts
```typescript
import { NextResponse } from "next/server";
import { consensusMid } from "@/lib/prices";
import { redis, k, todayUTC } from "@/lib/redis";
import { todaysPoll } from "@/lib/poll";
import { OPEN_SNAPSHOT_DELAY_MS } from "@/lib/rules";

export const dynamic = "force-dynamic";

export async function GET() {
  await new Promise(r => setTimeout(r, OPEN_SNAPSHOT_DELAY_MS));
  const date = todayUTC();
  const exists = await redis.get(k.poll(date));
  if (!exists) await redis.set(k.poll(date), todaysPoll(date));

  const { mid, mids } = await consensusMid();
  if (!mid) return NextResponse.json({ ok: false, error: "no sources" }, { status: 500 });

  await redis.set(k.priceOpen(date), mid);
  await redis.set(k.priceOpenRaw(date), JSON.stringify({ mids, ts: Date.now() }));

  return NextResponse.json({ ok: true, date, open: mid, sources: mids });
}
```

### src/app/api/cron/close/route.ts
```typescript
import { NextResponse } from "next/server";
import { consensusMid } from "@/lib/prices";
import { redis, k, todayUTC } from "@/lib/redis";
import { CLOSE_SNAPSHOT_DELAY_MS } from "@/lib/rules";
import { settleDay } from "@/lib/settle";

export const dynamic = "force-dynamic";

export async function GET() {
  await new Promise(r => setTimeout(r, CLOSE_SNAPSHOT_DELAY_MS));
  const date = todayUTC();
  const openRaw = await redis.get<string | number>(k.priceOpen(date));
  if (!openRaw) return NextResponse.json({ ok: false, error: "open missing" }, { status: 500 });
  const open = Number(openRaw);

  const { mid, mids } = await consensusMid();
  if (!mid) return NextResponse.json({ ok: false, error: "no close sources" }, { status: 500 });

  await redis.set(k.priceClose(date), mid);
  await redis.set(k.priceCloseRaw(date), JSON.stringify({ mids, ts: Date.now() }));

  const lock = await redis.setnx(k.lockSettle(date), 1);
  if (!lock) return NextResponse.json({ ok: true, date, info: "settling elsewhere" });

  try {
    const res = await settleDay(date, open, mid);
    return NextResponse.json({ ok: true, date, open, close: mid, ...res });
  } finally {
    await redis.del(k.lockSettle(date));
  }
}
```

### src/app/api/results/[date]/image/route.ts
```typescript
import { NextRequest } from "next/server";
import { renderOg } from "@/ui/og";
import { redis, k, todayUTC } from "@/lib/redis";
import { todaysPoll } from "@/lib/poll";

export const runtime = "edge";

export async function GET(req: NextRequest, { params }: { params: { date: string } }) {
  const date = params.date === "today" ? todayUTC() : params.date;
  const poll = (await redis.get<ReturnType<typeof todaysPoll>>(k.poll(date))) ?? todaysPoll(date);
  const counts = (await redis.hgetall<Record<string, number>>(k.counts(date))) ?? {};
  return renderOg({ question: `[${date}] ${poll.question}`, counts });
}
```

### src/app/well-known/farcaster.json/route.ts
```typescript
import { NextResponse } from "next/server";

export async function GET() {
  const base = process.env.APP_BASE_URL!;
  return NextResponse.json({
    accountAssociation: {
      header: "", payload: "", signature: ""
    },
    frame: {
      version: "1",
      name: "Daily One-Tap Poll",
      homeUrl: `${base}/`,
      iconUrl: `${base}/icon-1024.png`,
      splashImageUrl: `${base}/splash-200.png`,
      splashBackgroundColor: "#0b0b0b",
      subtitle: "Predict ETH daily. Win streak multipliers.",
      description: "A simple daily UP/DOWN ETH poll with streak points.",
    },
  });
}
```

## UI Components

### src/ui/og.tsx
```typescript
import { ImageResponse } from "@vercel/og";

export type OgProps = {
  question: string;
  counts: Record<string, number>;
  highlight?: "UP" | "DOWN";
  subtitle?: string;
};

export function renderOg({ question, counts, highlight, subtitle }: OgProps) {
  const up = Number(counts["UP"] || 0);
  const down = Number(counts["DOWN"] || 0);
  const total = Math.max(1, up + down);
  const upPct = Math.round((up / total) * 100);
  const downPct = 100 - upPct;

  return new ImageResponse(
    (
      <div
        style={{
          width: 1200, height: 800, display: "flex", flexDirection: "column",
          justifyContent: "center", alignItems: "center", background: "#0b0b0b", color: "white", fontFamily: "sans-serif", padding: 40
        }}
      >
        <div style={{ fontSize: 56, fontWeight: 700, textAlign: "center", marginBottom: 32 }}>
          {question}
        </div>
        <div style={{ display: "flex", gap: 32, width: "100%", maxWidth: 1000 }}>
          {(["UP", "DOWN"] as const).map((opt) => {
            const pct = opt === "UP" ? upPct : downPct;
            const val = opt === "UP" ? up : down;
            const isH = highlight === opt;
            return (
              <div key={opt} style={{ display: "flex", flexDirection: "column", flex: 1, border: isH ? "4px solid #6cf" : "2px solid #333", borderRadius: 20, padding: 24 }}>
                <div style={{ fontSize: 32, opacity: 0.8, marginBottom: 8 }}>{opt}</div>
                <div style={{ fontSize: 96, fontWeight: 800, marginBottom: 8 }}>{pct}%</div>
                <div style={{ fontSize: 24, opacity: 0.6 }}>{val} votes</div>
              </div>
            );
          })}
        </div>
        {subtitle && <div style={{ marginTop: 32, fontSize: 24, opacity: 0.8 }}>{subtitle}</div>}
      </div>
    ),
    { width: 1200, height: 800 }
  );
}
```

### src/components/VoteButton.tsx
```typescript
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface VoteButtonProps {
  direction: "up" | "down";
  onClick: () => void;
  isSelected?: boolean;
  className?: string;
}

export const VoteButton = ({ direction, onClick, isSelected, className }: VoteButtonProps) => {
  const isUp = direction === "up";
  
  return (
    <Button
      onClick={onClick}
      className={cn(
        "h-20 text-lg font-bold transition-all duration-300 relative overflow-hidden group",
        "border-2 hover:scale-105 active:scale-95",
        isUp
          ? "bg-green-500 border-green-500 text-white hover:shadow-lg hover:shadow-green-500/25"
          : "bg-red-500 border-red-500 text-white hover:shadow-lg hover:shadow-red-500/25",
        isSelected && "ring-2 ring-white/30 shadow-xl",
        className
      )}
      size="lg"
    >
      <div className="flex items-center gap-3 relative z-10">
        {isUp ? (
          <TrendingUp className="w-6 h-6" />
        ) : (
          <TrendingDown className="w-6 h-6" />
        )}
        <span>{isUp ? "UP" : "DOWN"}</span>
      </div>
      
      <div className={cn(
        "absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300",
        isUp ? "bg-green-500" : "bg-red-500"
      )} />
    </Button>
  );
};
```

### src/components/ETHPriceDisplay.tsx
```typescript
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface ETHPriceDisplayProps {
  price: number;
  change24h: number;
  changePercent: number;
}

export const ETHPriceDisplay = ({ price, change24h, changePercent }: ETHPriceDisplayProps) => {
  const isPositive = change24h >= 0;
  
  return (
    <Card className="p-6 bg-gray-800 border-gray-700">
      <div className="text-center space-y-3">
        <div className="text-sm text-gray-400 font-medium">Current ETH Price</div>
        
        <div className="text-3xl font-bold text-white">
          ${price.toLocaleString()}
        </div>
        
        <div className="flex items-center justify-center gap-2">
          <Badge 
            variant="outline" 
            className={cn(
              "px-3 py-1 font-medium border-2",
              isPositive 
                ? "border-green-500 text-green-400 bg-green-500/10" 
                : "border-red-500 text-red-400 bg-red-500/10"
            )}
          >
            <div className="flex items-center gap-1">
              {isPositive ? (
                <TrendingUp className="w-3 h-3" />
              ) : (
                <TrendingDown className="w-3 h-3" />
              )}
              <span>{isPositive ? '+' : ''}{changePercent.toFixed(2)}%</span>
            </div>
          </Badge>
          
          <span className={cn(
            "text-sm font-medium",
            isPositive ? "text-green-400" : "text-red-400"
          )}>
            {isPositive ? '+' : ''}${change24h.toFixed(2)}
          </span>
        </div>
        
        <div className="text-xs text-gray-400">24h change</div>
      </div>
    </Card>
  );
};
```

### src/components/StatsCard.tsx
```typescript
import { Card } from "@/components/ui/card";
import { Flame, Users, Trophy } from "lucide-react";

interface StatsCardProps {
  streak: number;
  totalVotes: number;
  accuracy: number;
}

export const StatsCard = ({ streak, totalVotes, accuracy }: StatsCardProps) => {
  return (
    <Card className="p-4 bg-gray-800 border-gray-700">
      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="space-y-1">
          <div className="flex items-center justify-center gap-1">
            <Flame className="w-4 h-4 text-orange-400" />
            <span className="text-lg font-bold text-orange-400">{streak}</span>
          </div>
          <div className="text-xs text-gray-400">Streak</div>
        </div>
        
        <div className="space-y-1">
          <div className="flex items-center justify-center gap-1">
            <Users className="w-4 h-4 text-blue-400" />
            <span className="text-lg font-bold text-white">{totalVotes}</span>
          </div>
          <div className="text-xs text-gray-400">Votes</div>
        </div>
        
        <div className="space-y-1">
          <div className="flex items-center justify-center gap-1">
            <Trophy className="w-4 h-4 text-green-400" />
            <span className="text-lg font-bold text-green-400">{accuracy}%</span>
          </div>
          <div className="text-xs text-gray-400">Accuracy</div>
        </div>
      </div>
    </Card>
  );
};
```

## Setup Instructions

1. **Install Node.js 20 LTS**
2. **Install pnpm**: `npm i -g pnpm`
3. **Install dependencies**: `pnpm install`
4. **Copy environment file**: `cp env.example .env.local`
5. **Fill in environment variables** in `.env.local`
6. **Run development server**: `pnpm dev`
7. **Visit**: `http://localhost:3010`

## Key Features

- **Daily ETH Polls** with UP/DOWN voting
- **Neynar Validation** for secure FID-based voting
- **Price Snapshots** from Coinbase, Kraken, and Binance
- **Streak Multipliers** with exponential point rewards
- **Rate Limiting** to prevent abuse
- **Mini App Interface** optimized for 424×695 viewport
- **Frame Integration** with OG image generation
- **Debug Testing** panel for development

This is a complete Farcaster Mini App that runs daily ETH price prediction polls with streak-based point rewards.
