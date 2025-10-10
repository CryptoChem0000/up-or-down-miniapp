import { NextResponse } from "next/server";
import { todayUTC } from "@/lib/redis";

export const runtime = "edge";

export async function GET() {
  return NextResponse.json({ 
    date: todayUTC(),
    timestamp: Date.now()
  });
}
