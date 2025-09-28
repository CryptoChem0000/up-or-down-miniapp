import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Test if we can import the SDK on the server side
    const { sdk } = await import("@farcaster/miniapp-sdk");
    
    return NextResponse.json({
      success: true,
      message: "SDK imported successfully",
      sdkMethods: Object.keys(sdk.actions || {}),
      sdkContext: typeof sdk.context
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}
