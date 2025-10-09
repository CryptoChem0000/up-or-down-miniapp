#!/usr/bin/env tsx
/**
 * Manual settlement script for backfilling stats
 * Usage: npx tsx scripts/manual-settle.ts 2025-10-08
 */

import { redis, k } from '../src/lib/redis';
import { settleDay } from '../src/lib/settle';

async function manualSettle(date: string) {
  console.log(`\n🔄 Manual settlement for ${date}`);
  console.log('━'.repeat(50));

  // Get open and close prices
  const open = await redis.get<string | number>(k.priceOpen(date));
  const close = await redis.get<string | number>(k.priceClose(date));

  if (!open || !close) {
    console.error('❌ Missing price data for', date);
    console.log('Open:', open);
    console.log('Close:', close);
    return;
  }

  const openNum = Number(open);
  const closeNum = Number(close);

  console.log(`📊 Prices: Open=$${openNum}, Close=$${closeNum}`);

  // Check if already settled
  const alreadySettled = await redis.get(k.settled(date));
  if (alreadySettled) {
    console.log('⚠️  Day already marked as settled. Clearing lock to re-settle...');
    await redis.del(k.settled(date));
    await redis.del(k.lockSettle(date));
  }

  // Run settlement
  try {
    console.log('\n⚙️  Running settlement...');
    const result = await settleDay(date, openNum, closeNum);
    console.log('\n✅ Settlement complete!');
    console.log(`Result: ${result.result}`);
    console.log(`Settled ${result.settledCount} votes`);
  } catch (error) {
    console.error('\n❌ Settlement failed:', error);
    throw error;
  }
}

const date = process.argv[2];
if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
  console.error('Usage: npx tsx scripts/manual-settle.ts YYYY-MM-DD');
  process.exit(1);
}

manualSettle(date)
  .then(() => {
    console.log('\n✨ Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Error:', error);
    process.exit(1);
  });

