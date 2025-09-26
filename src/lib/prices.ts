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
    // Kraken uses XETHZUSD (sometimes "ETHUSD" alias). We try both safely.
    const r = await fetch("https://api.kraken.com/0/public/Ticker?pair=ETHUSD", { cache: "no-store" });
    const j = await r.json();
    // Common keys: XETHZUSD or ETHUSD depending on response
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
    // USDT ~ USD for this purpose
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
