import { redis, k } from "./redis";

const KEY = "price:ETHUSD:v1";
const STALE_MS = 60_000;          // 60 seconds
const TTL_SEC = 90;               // cache survival
const LOCK_KEY = "lock:price:ETHUSD";
const LOCK_TTL = 5;               // seconds

type PriceData = {
  price: number;
  change24h: number;
  changePercent: number;
  ts: number;
  source: string;
};

async function fetchUpstreamPrice(): Promise<PriceData> {
  const res = await fetch(
    "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd&include_24hr_change=true",
    { headers: { accept: "application/json" }, cache: "no-store" }
  );
  const json = await res.json();
  const price = Number(json?.ethereum?.usd);
  const changePercent = Number(json?.ethereum?.usd_24h_change);
  
  if (!Number.isFinite(price)) throw new Error("Bad price from CoinGecko");
  if (!Number.isFinite(changePercent)) throw new Error("Bad 24h change from CoinGecko");
  
  // Calculate dollar amount change from percentage
  const change24h = (price * changePercent) / 100;
  
  return { 
    price, 
    change24h, 
    changePercent, 
    source: "coingecko", 
    ts: Date.now() 
  };
}

export async function getServerPrice(): Promise<PriceData> {
  const now = Date.now();
  const cached = await redis.get<PriceData>(KEY);

  // fresh enough → just return
  if (cached && now - cached.ts < STALE_MS) {
    return cached;
  }

  // try to acquire a short lock so only 1 request refreshes upstream
  const gotLock = await redis.set(LOCK_KEY, "1", { nx: true, ex: LOCK_TTL });

  if (!gotLock) {
    // someone else is refreshing; return stale (or empty) quickly
    if (cached) return cached;
    // no cache at all → fall back to a single upstream try
  }

  const fresh = await fetchUpstreamPrice();
  const payload = { 
    price: fresh.price, 
    change24h: fresh.change24h, 
    changePercent: fresh.changePercent,
    ts: now, 
    source: fresh.source 
  };
  await redis.set(KEY, payload, { ex: TTL_SEC });
  return payload;
}

// Legacy function for backward compatibility
export async function consensusMid(): Promise<{ mid?: number; mids: Array<{ venue: string; mid: number }> }> {
  const priceData = await getServerPrice();
  return { 
    mid: priceData.price, 
    mids: [{ venue: priceData.source, mid: priceData.price }] 
  };
}