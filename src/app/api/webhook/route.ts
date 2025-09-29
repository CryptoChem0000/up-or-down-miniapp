import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    console.log("🔔 Farcaster Webhook received:", {
      type: body.type,
      timestamp: new Date().toISOString(),
      data: body
    });

    // Handle different webhook event types
    switch (body.type) {
      case "user.install":
        console.log("📱 User installed the app:", body.data);
        // You could track app installations here
        break;
        
      case "user.uninstall":
        console.log("📱 User uninstalled the app:", body.data);
        // You could clean up user data here
        break;
        
      case "user.action":
        console.log("🎯 User performed action:", body.data);
        // You could track user interactions here
        break;
        
      case "app.update":
        console.log("🔄 App update notification:", body.data);
        // You could handle app updates here
        break;
        
      default:
        console.log("❓ Unknown webhook event type:", body.type);
    }

    // Always return 200 OK to acknowledge receipt
    return NextResponse.json({ 
      success: true, 
      message: "Webhook received successfully",
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error("❌ Webhook error:", error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to process webhook",
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

// Handle GET requests (for webhook verification)
export async function GET() {
  return NextResponse.json({ 
    message: "Farcaster webhook endpoint is active",
    timestamp: new Date().toISOString()
  });
}
