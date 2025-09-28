import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    test: "manifest route works",
    timestamp: new Date().toISOString()
  });
}
