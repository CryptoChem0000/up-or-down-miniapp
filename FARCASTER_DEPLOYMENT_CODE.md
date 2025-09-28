# Farcaster Mini App Deployment Code

This file contains all the code being utilized to deploy the Farcaster Mini App.

## 1. Farcaster SDK Integration (`src/components/FarcasterSDK.tsx`)

```typescript
"use client";

import { useEffect } from "react";

export function FarcasterSDK() {
  useEffect(() => {
    const initializeSDK = async () => {
      console.log("Initializing Farcaster SDK...");
      
      try {
        // Check if we're in a Farcaster environment (iframe)
        if (typeof window !== "undefined" && window.parent !== window) {
          console.log("Detected iframe environment, attempting SDK initialization");
          
          try {
            // Import SDK exactly as shown in official documentation
            const { sdk } = await import("@farcaster/miniapp-sdk");
            console.log("SDK imported successfully");
            
            // Call ready() exactly as per official documentation
            // This is the critical call that hides the splash screen
            await sdk.actions.ready();
            console.log("✅ SDK ready() called successfully - splash screen should hide");
            
            // Get context for debugging
            try {
              const context = await sdk.context;
              console.log("SDK Context:", context);
            } catch (contextError) {
              console.log("Context error:", contextError);
            }
            
          } catch (sdkError) {
            console.log("SDK approach failed:", sdkError);
            
            // Fallback: Try postMessage
            try {
              window.parent.postMessage({ 
                type: "ready",
                source: "farcaster-miniapp"
              }, "*");
              console.log("✅ Sent ready message via postMessage fallback");
            } catch (postError) {
              console.log("PostMessage failed:", postError);
            }
          }
          
        } else {
          console.log("Not in iframe environment, skipping SDK initialization");
        }
      } catch (error) {
        console.log("SDK initialization failed:", error);
        
        // Fallback: Try postMessage anyway
        try {
          if (typeof window !== "undefined" && window.parent !== window) {
            window.parent.postMessage({ 
              type: "ready",
              source: "farcaster-miniapp-fallback"
            }, "*");
            console.log("✅ Fallback postMessage sent");
          }
        } catch (fallbackError) {
          console.log("Fallback also failed:", fallbackError);
        }
      }
    };

    // Try immediately and also with a delay
    initializeSDK();
    const timer = setTimeout(initializeSDK, 500);
    
    return () => clearTimeout(timer);
  }, []);

  return null; // This component doesn't render anything
}
```

## 2. Mini App Manifest Route (`src/app/well-known/farcaster.json/route.ts`)

```typescript
import { NextResponse } from "next/server";

// Force deployment - manifest route
export async function GET() {
  const base = process.env.APP_BASE_URL!;
  return NextResponse.json({
    accountAssociation: {
      header: "", payload: "", signature: ""
    },
    miniapp: {
      version: "1",
      name: "ETH Daily",
      iconUrl: `${base}/icon-1024.png`,
      homeUrl: `${base}/`,
      imageUrl: `${base}/api/results/today/image`,
      buttonTitle: "🚀 Start",
      splashImageUrl: `${base}/icon-1024.png`,
      splashBackgroundColor: "#0b0b0b"
    },
  });
}
```

## 3. Layout with Meta Tags (`src/app/layout.tsx`)

```typescript
import type { Metadata } from "next";
import "./globals.css";
import { miniAppEmbedJSON } from "@/lib/miniapp";
import { ClientToaster } from "@/components/ClientToaster";

const baseUrl = process.env.APP_BASE_URL || "http://localhost:3010";

export const metadata: Metadata = {
  title: "Ethereum",
  description: "Predict ETH daily. Win streak multipliers.",
  icons: {
    icon: [
      { url: "/icon-64.png" },
      { url: "/icon-128.png", sizes: "128x128" },
      { url: "/icon-256.png", sizes: "256x256" },
      { url: "/icon-512.png", sizes: "512x512" },
    ],
    apple: [{ url: "/icon-256.png" }],
  },
  other: {
    "fc:miniapp": miniAppEmbedJSON(baseUrl),
    "fc:frame": miniAppEmbedJSON(baseUrl),
    "og:title": "Ethereum",
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

## 4. Mini App Embed Helper (`src/lib/miniapp.ts`)

```typescript
export function miniAppEmbedJSON(baseUrl: string) {
  return JSON.stringify({
    version: "1",
    imageUrl: `${baseUrl}/api/results/today/image`, // 3:2 image
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

## 5. Main App Integration (`src/app/page.tsx` - Key Parts)

```typescript
"use client";

import React, { useState } from "react";
import { FarcasterSDK } from "@/components/FarcasterSDK";
// ... other imports

export default function DailyOneTapPoll() {
  // ... component logic

  return (
    <>
      <FarcasterSDK />
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        {/* App content */}
      </div>
    </>
  );
}
```

## 6. Package Dependencies (`package.json` - Key Dependencies)

```json
{
  "name": "daily-one-tap-poll",
  "version": "1.0.1",
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
    "@farcaster/miniapp-sdk": "^0.1.10",
    "next": "14.1.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  }
}
```

## 7. Static Manifest File (`public/.well-known/farcaster.json`)

```json
{
  "accountAssociation": {
    "header": "",
    "payload": "",
    "signature": ""
  },
  "miniapp": {
    "version": "1",
    "name": "ETH Daily (Testing)",
    "iconUrl": "https://up-or-down-miniapp.vercel.app/icon-1024.png",
    "homeUrl": "https://up-or-down-miniapp.vercel.app/",
    "imageUrl": "https://up-or-down-miniapp.vercel.app/api/results/today/image",
    "buttonTitle": "🚀 Start",
    "splashImageUrl": "https://up-or-down-miniapp.vercel.app/icon-1024.png",
    "splashBackgroundColor": "#0b0b0b"
  }
}
```

## 8. Next.js Configuration (`next.config.mjs`)

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: { allowedOrigins: ['*'] }
  },
  transpilePackages: ['frames.js'],
  productionBrowserSourceMaps: false,
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

## 9. Vercel Configuration (`vercel.json`)

```json
{
  "crons": [
    {
      "path": "/api/cron/open",
      "schedule": "15 0 * * *"
    },
    {
      "path": "/api/cron/close",
      "schedule": "45 23 * * *"
    },
    {
      "path": "/api/price",
      "schedule": "* * * * *"
    }
  ]
}
```

## 10. Environment Variables Required

```bash
# Required for Farcaster Mini App deployment
APP_BASE_URL=https://up-or-down-miniapp.vercel.app
UPSTASH_REDIS_REST_URL=your_redis_url
UPSTASH_REDIS_REST_TOKEN=your_redis_token
NEYNAR_API_KEY=your_neynar_key
CRON_SECRET=your_cron_secret
ADMIN_TOKEN=your_admin_token
```

## 11. Deployment URLs

- **Production**: `https://up-or-down-miniapp.vercel.app`
- **Staging**: `https://up-or-down-miniapp-git-staging-maxs-projects-302aab92.vercel.app`

## 12. Key Features for Farcaster Integration

1. **SDK Integration** - Calls `sdk.actions.ready()` to hide splash screen
2. **Manifest** - Proper Farcaster Mini App manifest at `/.well-known/farcaster.json`
3. **Meta Tags** - `fc:miniapp` and `fc:frame` meta tags for embedding
4. **Fallback Support** - Multiple approaches if SDK fails
5. **Context Access** - User, client, and location information
6. **Error Handling** - Comprehensive logging and fallbacks

## 13. Deployment Checklist

- [ ] Node.js 22.11.0 or higher installed
- [ ] `@farcaster/miniapp-sdk` dependency installed
- [ ] FarcasterSDK component integrated in main app
- [ ] Manifest route accessible at `/.well-known/farcaster.json`
- [ ] Meta tags properly configured in layout
- [ ] Environment variables set in Vercel
- [ ] App builds successfully (`npm run build`)
- [ ] Manifest returns valid JSON
- [ ] SDK ready() call implemented
- [ ] Splash screen configuration set

## 14. Troubleshooting

### Common Issues:
1. **Infinite Loading Screen** - Ensure `sdk.actions.ready()` is called
2. **Manifest 404** - Check route structure and deployment
3. **SDK Import Errors** - Verify Node.js version and dependencies
4. **Context Access** - Use `await sdk.context` for async access

### Debug Steps:
1. Check browser console for SDK logs
2. Verify manifest accessibility
3. Test in Farcaster environment
4. Check environment variables
5. Verify build success

This comprehensive code provides everything needed to deploy a Farcaster Mini App successfully.
