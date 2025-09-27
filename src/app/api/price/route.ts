import { NextResponse } from "next/server";
import { getServerPrice } from "@/lib/prices";

export const runtime = "edge";

export async function GET() {
  try {
    const priceData = await getServerPrice();
    return NextResponse.json(priceData);
  } catch (error) {
    console.error("Price API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch price" },
      { status: 500 }
    );
  }
}
