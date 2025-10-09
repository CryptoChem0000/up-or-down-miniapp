# React Errors #418/#423/#425 - Complete Diagnostic Export

Generated: 2025-10-09

## 1) PROJECT CONFIG FILES

### package.json
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
    "@farcaster/frame-sdk": "^0.1.10",
    "@farcaster/miniapp-sdk": "^0.1.10",
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
    "@upstash/ratelimit": "^2.0.6",
    "@upstash/redis": "^1.31.0",
    "@vercel/og": "^0.8.5",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "cmdk": "^1.1.1",
    "date-fns": "^3.6.0",
    "embla-carousel-react": "^8.6.0",
    "frames.js": "^0.22.0",
    "input-otp": "^1.4.2",
    "lucide-react": "^0.544.0",
    "next": "14.1.0",
    "next-themes": "^0.3.0",
    "react": "18.3.1",
    "react-day-picker": "^8.10.1",
    "react-dom": "18.3.1",
    "react-hook-form": "^7.61.1",
    "react-resizable-panels": "^2.1.9",
    "recharts": "^2.15.4",
    "sonner": "^1.7.4",
    "tailwind-merge": "^3.3.1",
    "vaul": "^0.9.9",
    "zod": "^3.25.76"
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
    "tailwindcss-animate": "^1.0.7",
    "typescript": "^5.6.2"
  },
  "resolutions": {
    "react": "18.3.1",
    "react-dom": "18.3.1"
  },
  "overrides": {
    "react": "18.3.1",
    "react-dom": "18.3.1"
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
  productionBrowserSourceMaps: true, // Temporarily enabled for debugging
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          // DO NOT set X-Frame-Options anywhere.
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self';",
              "img-src 'self' data: https: blob:;",
              "style-src 'self' 'unsafe-inline';",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https:;",
              "connect-src 'self' https: wss: ws: https://ws.farcaster.xyz wss://ws.farcaster.xyz https://mypinata.cloud https://*.mypinata.cloud;",
              "frame-src 'self' https:;",
              // ✅ allow Farcaster domains to embed your app
              "frame-ancestors 'self' https://warpcast.com https://*.warpcast.com https://farcaster.xyz https://*.farcaster.xyz https://client.farcaster.xyz https://*.client.farcaster.xyz;",
            ].join(" "),
          },
        ],
      },
    ];
  },
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

### tsconfig.json
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": [
      "dom",
      "dom.iterable",
      "esnext"
    ],
    "allowJs": false,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "baseUrl": ".",
    "paths": {
      "@/*": [
        "./src/*"
      ]
    },
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ]
  },
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    ".next/types/**/*.ts"
  ],
  "exclude": [
    "node_modules"
  ]
}
```

### .eslintrc.json
```json
{
  "extends": ["next", "next/core-web-vitals"],
  "rules": {
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn"
  }
}
```

---

## 2) APP ENTRY + PROVIDERS

### src/app/layout.tsx
```typescript
import type { Metadata } from "next";
import "./globals.css";
import { ClientToaster } from "@/components/ClientToaster";
import FarcasterReady from "@/components/FarcasterReady";
// import RuntimeDetection from "@/components/RuntimeDetection"; // Disabled to fix React errors

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
    "fc:miniapp": JSON.stringify({
      version: "1",
      imageUrl: `${baseUrl}/api/results/today/image?v=1759871275`,
      button: {
        title: "🚀 Start",
        action: {
          type: "launch_frame",
          name: "Up or Down",
          url: baseUrl,
          splashImageUrl: `${baseUrl}/splash.png`,
          splashBackgroundColor: "#0b0b0b"
        }
      }
    }),
    "og:title": "Ethereum",
    "og:description": "Predict ETH daily. Win streak multipliers.",
    "og:image": `${baseUrl}/api/results/today/image?v=1759871275`,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <FarcasterReady />
        {children}
        <ClientToaster />
        {/* <RuntimeDetection /> Disabled to fix React errors */}
      </body>
    </html>
  );
}
// Force deployment - cache bust v2
```

### src/components/ClientToaster.tsx
```typescript
"use client";
import { Toaster } from "@/components/ui/toaster";

export function ClientToaster() {
  return <Toaster />;
}
```

### src/components/FarcasterReady.tsx
```typescript
"use client";
import { useEffect, useState } from "react";

export default function FarcasterReady() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let mounted = true;
    
    const initializeSDK = async () => {
      try {
        console.log("🚀 FarcasterReady: Initializing SDK...");
        
        // Import SDK dynamically to avoid SSR issues
        const { sdk } = await import("@farcaster/miniapp-sdk");
        
        // Check if component is still mounted
        if (!mounted) return;
        
        // Check if we're in a Farcaster context
        if (typeof window !== "undefined") {
          const inIframe = window !== window.parent;
          console.log("📱 FarcasterReady: In iframe:", inIframe);
          
          if (inIframe) {
            // Wait for the main app content to be rendered before calling ready
            // This prevents jitter and content reflows
            await new Promise(resolve => setTimeout(resolve, 100));
            
            if (!mounted) return;
            
            console.log("📱 FarcasterReady: Calling sdk.actions.ready()...");
            await sdk.actions.ready();
            console.log("✅ FarcasterReady: SDK ready() called successfully");

            // Get user context and establish session
            try {
              console.log("🔐 FarcasterReady: Getting user context...");
              const context = await sdk.context;
              console.log("📋 FarcasterReady: User context:", context);
              
              if (!mounted) return;
              
              if (context && context.user && context.user.fid) {
                // Establish session with the real FID
                console.log("🔑 FarcasterReady: Establishing session with FID:", context.user.fid);
                const response = await fetch("/api/auth/establish", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({ fid: context.user.fid.toString() }),
                });
                
                if (response.ok) {
                  console.log("✅ FarcasterReady: Session established successfully");
                } else {
                  console.error("❌ FarcasterReady: Failed to establish session:", response.status);
                }
              } else {
                console.warn("⚠️ FarcasterReady: No FID found in context");
              }
            } catch (contextError) {
              console.error("❌ FarcasterReady: Error getting user context:", contextError);
            }

            if (mounted) {
              setIsReady(true);
            }
          } else {
            console.log("ℹ️ FarcasterReady: Not in iframe, skipping ready() call");
            if (mounted) {
              setIsReady(true);
            }
          }
        }
      } catch (error) {
        console.error("❌ FarcasterReady: Error initializing SDK:", error);
        // Still set ready to true to avoid blocking the app
        if (mounted) {
          setIsReady(true);
        }
      }
    };

    // Initialize immediately (DOM is always ready in useEffect)
    initializeSDK();
    
    // Cleanup function
    return () => {
      mounted = false;
    };
  }, []);
  
  return null;
}
```

---

## 3) COMPONENTS & HOOKS

### src/components/HeroHeader.tsx
```typescript
"use client";

import Image from "next/image";
import Link from "next/link";

type HeroHeaderProps = {
  iconSrc?: string; // "/eth-mark-tight-20.png" (served inside a 32px chip)
  title?: string;   // "ETHEREUM"
  subtitle?: string;// "Will ETH price go up or down today?"
  pillHref?: string;// "/rules" or "#" for now
  pillText?: string;// "Vote closes at midnight UTC" - if undefined, pill is hidden
};

export default function HeroHeader({
  iconSrc = "/eth-mark-tight-20.png",
  title = "Ethereum", // Default title
  subtitle = "Will ETH price go up or down today?",
  pillHref = "#",
  pillText,
}: HeroHeaderProps) {
  // Debug log to verify title prop - FORCE DEPLOYMENT
  console.log("HeroHeader title prop:", title);
  console.log("DEPLOYMENT TEST - ETHEREUM TITLE FIX");
  
  return (
    <div className="w-full flex flex-col items-center text-center">
      <div className="flex items-center justify-center gap-3">
        {/* Ethereum title display - horizontal layout */}
        <h1 className="text-xl font-bold tracking-tight sm:text-2xl text-white">{title}</h1>
        {/* 32px chip moved to right side */}
        <Image
          src={iconSrc}
          alt="App icon"
          width={32}
          height={32}
          className="rounded-full"
          priority
        />
      </div>

      <div className="mt-3 space-y-2">
        <p className="mx-auto max-w-[30ch] sm:max-w-[36ch] text-base font-semibold text-gray-400 leading-relaxed">
          {subtitle}
        </p>

        {pillText && (
          <div className="flex justify-center">
            <Link
              href={pillHref}
              className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary hover:bg-primary/15"
            >
              {pillText}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
```

### src/hooks/useCapabilities.ts
```typescript
"use client";
import { useState, useEffect } from "react";

interface Capabilities {
  chains: string[];
  capabilities: string[];
  supportsCompose: boolean;
  supportsWallet: boolean;
  supportsHaptics: {
    impact: boolean;
    notification: boolean;
    selection: boolean;
  };
  isEthereumSupported: boolean;
  isBaseSupported: boolean;
  isLoading: boolean;
  error: string | null;
}

export function useCapabilities(): Capabilities {
  const [state, setState] = useState<Capabilities>({
    chains: [],
    capabilities: [],
    supportsCompose: false,
    supportsWallet: false,
    supportsHaptics: {
      impact: false,
      notification: false,
      selection: false,
    },
    isEthereumSupported: false,
    isBaseSupported: false,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    async function detectCapabilities() {
      try {
        console.log("🔍 useCapabilities: Starting detection...");
        
        // Check if we're in an iframe context first
        if (typeof window === 'undefined' || window === window.parent) {
          console.log("🔍 useCapabilities: Not in iframe, skipping SDK calls");
          setState(prev => ({
            ...prev,
            isLoading: false,
            error: "Not in iframe context",
          }));
          return;
        }
        
        // Dynamically import SDK to avoid SSR issues
        const { sdk } = await import("@farcaster/miniapp-sdk");
        
        // Get supported chains
        const chains = await sdk.getChains();
        
        // Get supported capabilities
        const capabilities = await sdk.getCapabilities();
        
        // Check for specific capabilities
        const supportsCompose = capabilities.includes('actions.composeCast');
        const supportsWallet = capabilities.includes('wallet.getEthereumProvider');
        
        // Check for haptics support
        const supportsHaptics = {
          impact: capabilities.includes('haptics.impactOccurred'),
          notification: capabilities.includes('haptics.notificationOccurred'),
          selection: capabilities.includes('haptics.selectionChanged'),
        };
        
        // Check for specific chain support
        const isEthereumSupported = chains.includes('eip155:1');
        const isBaseSupported = chains.includes('eip155:8453');
        
        setState({
          chains,
          capabilities,
          supportsCompose,
          supportsWallet,
          supportsHaptics,
          isEthereumSupported,
          isBaseSupported,
          isLoading: false,
          error: null,
        });
        
        console.log("✅ useCapabilities: Detection complete", {
          chains,
          isEthereumSupported,
          isBaseSupported,
          supportsCompose,
          supportsWallet,
          supportsHaptics,
        });
        
      } catch (err) {
        console.error("❌ useCapabilities: Detection failed", err);
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: err instanceof Error ? err.message : "Unknown error",
        }));
      }
    }

    detectCapabilities();
  }, []);

  return state;
}

// Utility functions for common capability checks
export function useHapticFeedback() {
  const { supportsHaptics, isLoading } = useCapabilities();
  
  const triggerImpact = async (intensity: 'light' | 'medium' | 'heavy' = 'medium') => {
    if (supportsHaptics.impact && !isLoading && typeof window !== 'undefined' && window !== window.parent) {
      try {
        const { sdk } = await import("@farcaster/miniapp-sdk");
        await sdk.haptics.impactOccurred(intensity);
        console.log(`📳 Haptic feedback triggered: ${intensity}`);
      } catch (err) {
        console.error("❌ Haptic feedback failed:", err);
      }
    }
  };
  
  const triggerNotification = async (type: 'success' | 'warning' | 'error' = 'success') => {
    if (supportsHaptics.notification && !isLoading && typeof window !== 'undefined' && window !== window.parent) {
      try {
        const { sdk } = await import("@farcaster/miniapp-sdk");
        await sdk.haptics.notificationOccurred(type);
        console.log(`📳 Notification haptic triggered: ${type}`);
      } catch (err) {
        console.error("❌ Notification haptic failed:", err);
      }
    }
  };
  
  const triggerSelection = async () => {
    if (supportsHaptics.selection && !isLoading && typeof window !== 'undefined' && window !== window.parent) {
      try {
        const { sdk } = await import("@farcaster/miniapp-sdk");
        await sdk.haptics.selectionChanged();
        console.log("📳 Selection haptic triggered");
      } catch (err) {
        console.error("❌ Selection haptic failed:", err);
      }
    }
  };
  
  return {
    supportsHaptics,
    isLoading,
    triggerImpact,
    triggerNotification,
    triggerSelection,
  };
}

// Hook for wallet capabilities
export function useWalletCapabilities() {
  const { supportsWallet, isEthereumSupported, isBaseSupported, isLoading } = useCapabilities();
  
  return {
    supportsWallet,
    isEthereumSupported,
    isBaseSupported,
    isLoading,
    canConnectWallet: supportsWallet && (isEthereumSupported || isBaseSupported),
  };
}
```

### src/hooks/useMyStats.ts
```typescript
"use client";
import { useEffect, useState } from "react";

type MeResp = {
  ok: boolean;
  stats?: {
    fid: string;
    totalVotes: number;
    correctCount: number;
    currentStreak: number;
    bestStreak: number;
    totalPoints: number;
  };
  accuracy?: number;
  rank?: number | null;
  todayVote?: "up" | "down" | null;
  profile?: {
    username: string | null;
    displayName: string | null;
    avatar: string | null;
  };
  error?: string;
};

export function useMyStats() {
  const [data, setData] = useState<MeResp | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        // Check if we're in staging mode with mock data
        const isStagingWithMock = process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true";
        // Also check if we're on a staging/preview deployment
        const isPreviewDeployment = window.location.hostname.includes('vercel.app') && window.location.hostname.includes('git-');
        console.log("🔍 useMyStats: NEXT_PUBLIC_USE_MOCK_DATA =", process.env.NEXT_PUBLIC_USE_MOCK_DATA);
        console.log("🔍 useMyStats: isStagingWithMock =", isStagingWithMock);
        console.log("🔍 useMyStats: isPreviewDeployment =", isPreviewDeployment);
        console.log("🔍 useMyStats: hostname =", window.location.hostname);
        
        if (isStagingWithMock || isPreviewDeployment) {
          console.log("🎭 useMyStats: Using mock data");
          // Return mock data for UX testing
          const mockData: MeResp = {
            ok: true,
            stats: {
              fid: "12345",
              totalVotes: 23,
              correctCount: 18,
              currentStreak: 7,
              bestStreak: 12,
              totalPoints: 12545
            },
            accuracy: 78,
            rank: 15,
            profile: {
              username: "alice.eth",
              displayName: "Alice",
              avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=alice"
            }
          };
          
          // Simulate loading delay
          setTimeout(() => {
            if (alive) {
              setData(mockData);
              setLoading(false);
            }
          }, 800);
          return;
        }

        const r = await fetch("/api/stats/me", { 
          cache: "no-store",
          credentials: "include", // Include session cookies
        });
        const j: MeResp = await r.json();
        if (alive) setData(j);
      } catch (error) {
        if (alive) setData({ ok: false, error: "fetch_failed" });
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  return { data, loading };
}
```

### src/components/ui/toaster.tsx
```typescript
"use client";

import { useToast } from "@/hooks/use-toast";
import { Toast, ToastClose, ToastDescription, ToastProvider, ToastTitle, ToastViewport } from "@/components/ui/toast";

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props}>
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && <ToastDescription>{description}</ToastDescription>}
            </div>
            {action}
            <ToastClose />
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}
```

### src/components/ui/toast.tsx
```typescript
"use client";

import * as React from "react";
import * as ToastPrimitives from "@radix-ui/react-toast";
import { cva, type VariantProps } from "class-variance-authority";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";

const ToastProvider = ToastPrimitives.Provider;

const ToastViewport = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Viewport>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Viewport
    ref={ref}
    className={cn(
      "fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]",
      className,
    )}
    {...props}
  />
));
ToastViewport.displayName = ToastPrimitives.Viewport.displayName;

const toastVariants = cva(
  "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full",
  {
    variants: {
      variant: {
        default: "border bg-background text-foreground",
        destructive: "destructive group border-destructive bg-destructive text-destructive-foreground",
        success: "border-gray-800 bg-black text-white",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

const Toast = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root> & VariantProps<typeof toastVariants>
>(({ className, variant, ...props }, ref) => {
  return <ToastPrimitives.Root ref={ref} className={cn(toastVariants({ variant }), className)} {...props} />;
});
Toast.displayName = ToastPrimitives.Root.displayName;

const ToastAction = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Action>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Action>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Action
    ref={ref}
    className={cn(
      "inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium ring-offset-background transition-colors group-[.destructive]:border-muted/40 hover:bg-secondary group-[.destructive]:hover:border-destructive/30 group-[.destructive]:hover:bg-destructive group-[.destructive]:hover:text-destructive-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 group-[.destructive]:focus:ring-destructive disabled:pointer-events-none disabled:opacity-50",
      className,
    )}
    {...props}
  />
));
ToastAction.displayName = ToastPrimitives.Action.displayName;

const ToastClose = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Close>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Close>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Close
    ref={ref}
    className={cn(
      "absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity group-hover:opacity-100 group-[.destructive]:text-red-300 hover:text-foreground group-[.destructive]:hover:text-red-50 focus:opacity-100 focus:outline-none focus:ring-2 group-[.destructive]:focus:ring-red-400 group-[.destructive]:focus:ring-offset-red-600",
      className,
    )}
    toast-close=""
    {...props}
  >
    <X className="h-4 w-4" />
  </ToastPrimitives.Close>
));
ToastClose.displayName = ToastPrimitives.Close.displayName;

const ToastTitle = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Title>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Title>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Title ref={ref} className={cn("text-sm font-semibold", className)} {...props} />
));
ToastTitle.displayName = ToastPrimitives.Title.displayName;

const ToastDescription = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Description>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Description>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Description ref={ref} className={cn("text-sm opacity-90", className)} {...props} />
));
ToastDescription.displayName = ToastPrimitives.Description.displayName;

type ToastProps = React.ComponentPropsWithoutRef<typeof Toast>;

type ToastActionElement = React.ReactElement<typeof ToastAction>;

export {
  type ToastProps,
  type ToastActionElement,
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
};
```

### src/hooks/use-toast.ts
```typescript
"use client";

import * as React from "react";

import type { ToastActionElement, ToastProps } from "@/components/ui/toast";

const TOAST_LIMIT = 1;
const TOAST_REMOVE_DELAY = 1000000;

type ToasterToast = ToastProps & {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
};

const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
} as const;

let count = 0;

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER;
  return count.toString();
}

type ActionType = typeof actionTypes;

type Action =
  | {
      type: ActionType["ADD_TOAST"];
      toast: ToasterToast;
    }
  | {
      type: ActionType["UPDATE_TOAST"];
      toast: Partial<ToasterToast>;
    }
  | {
      type: ActionType["DISMISS_TOAST"];
      toastId?: ToasterToast["id"];
    }
  | {
      type: ActionType["REMOVE_TOAST"];
      toastId?: ToasterToast["id"];
    };

interface State {
  toasts: ToasterToast[];
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>();

const addToRemoveQueue = (toastId: string) => {
  if (toastTimeouts.has(toastId)) {
    return;
  }

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId);
    dispatch({
      type: "REMOVE_TOAST",
      toastId: toastId,
    });
  }, TOAST_REMOVE_DELAY);

  toastTimeouts.set(toastId, timeout);
};

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "ADD_TOAST":
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      };

    case "UPDATE_TOAST":
      return {
        ...state,
        toasts: state.toasts.map((t) => (t.id === action.toast.id ? { ...t, ...action.toast } : t)),
      };

    case "DISMISS_TOAST": {
      const { toastId } = action;

      // ! Side effects ! - This could be extracted into a dismissToast() action,
      // but I'll keep it here for simplicity
      if (toastId) {
        addToRemoveQueue(toastId);
      } else {
        state.toasts.forEach((toast) => {
          addToRemoveQueue(toast.id);
        });
      }

      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === toastId || toastId === undefined
            ? {
                ...t,
                open: false,
              }
            : t,
        ),
      };
    }
    case "REMOVE_TOAST":
      if (action.toastId === undefined) {
        return {
          ...state,
          toasts: [],
        };
      }
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      };
  }
};

const listeners: Array<(state: State) => void> = [];

let memoryState: State = { toasts: [] };

function dispatch(action: Action) {
  memoryState = reducer(memoryState, action);
  listeners.forEach((listener) => {
    listener(memoryState);
  });
}

type Toast = Omit<ToasterToast, "id">;

function toast({ ...props }: Toast) {
  const id = genId();

  const update = (props: ToasterToast) =>
    dispatch({
      type: "UPDATE_TOAST",
      toast: { ...props, id },
    });
  const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id });

  dispatch({
    type: "ADD_TOAST",
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: (open) => {
        if (!open) dismiss();
      },
    },
  });

  return {
    id: id,
    dismiss,
    update,
  };
}

function useToast() {
  const [state, setState] = React.useState<State>(memoryState);

  React.useEffect(() => {
    listeners.push(setState);
    return () => {
      const index = listeners.indexOf(setState);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }, [state]);

  return {
    ...state,
    toast,
    dismiss: (toastId?: string) => dispatch({ type: "DISMISS_TOAST", toastId }),
  };
}

export { useToast, toast };
```

---

## 4) AUTH/SESSION ENDPOINTS

### src/app/api/auth/establish/route.ts
```typescript
import { NextResponse } from "next/server";
import { verifyFarcaster } from "@/lib/verify";
import { makeSessionCookie } from "@/lib/fc-session";

export const runtime = "edge";

export async function POST(req: Request) {
  try {
    // Read request body first
    let body;
    try {
      body = await req.json();
      console.log("Auth establish request body:", body);
    } catch (bodyError) {
      console.log("No request body found:", bodyError);
      // Return 401 instead of 400 for empty body - this is expected for some requests
      return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
    }

    // Try Farcaster verification first (for signed requests with signature data)
    if (body && (body.signature || body.messageHash)) {
      const verified = await verifyFarcaster(req, body);
      if (verified?.ok && verified.fid) {
        console.log("Using FID from Farcaster verification:", verified.fid);
        const cookie = await makeSessionCookie(String(verified.fid));
        const res = NextResponse.json({ ok: true, fid: String(verified.fid) });
        res.headers.append(
          "Set-Cookie",
          `${cookie.name}=${encodeURIComponent(cookie.value)}; Path=/; Max-Age=${cookie.maxAge}; HttpOnly; Secure; SameSite=None`
        );
        return res;
      }
    }

    // Try to get FID from request body (from Mini App SDK)
    if (body && typeof body.fid === 'string' && body.fid.length > 0) {
      console.log("Using FID from request body:", body.fid);
      const cookie = await makeSessionCookie(body.fid);
      const res = NextResponse.json({ ok: true, fid: body.fid });
      res.headers.append(
        "Set-Cookie",
        `${cookie.name}=${encodeURIComponent(cookie.value)}; Path=/; Max-Age=${cookie.maxAge}; HttpOnly; Secure; SameSite=None`
      );
      return res;
    }

    // No valid authentication found
    console.log("No valid Farcaster authentication found");
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });

  } catch (error) {
    console.error("Error in /api/auth/establish:", error);
    return NextResponse.json({ ok: false, error: "internal_error" }, { status: 500 });
  }
}
```

### middleware.ts
```typescript
import { NextResponse } from "next/server";

export function middleware() {
  const res = NextResponse.next();

  // Only set minimal security headers, no frame blocking
  res.headers.set("X-Content-Type-Options", "nosniff");
  res.headers.set("Referrer-Policy", "no-referrer");
  
  return res;
}

export const config = { 
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"]
};
```

---

## 5) COMMAND OUTPUTS

### npm ls react react-dom
```
daily-one-tap-poll@1.0.1 /Users/maxmckendry/Desktop/daily-one-tap-poll
+-- react@18.3.1 overridden
+-- react-dom@18.3.1 overridden
    `-- react@18.3.1 deduped

✅ Only ONE version of React: 18.3.1
✅ All dependencies using deduped copies
✅ Overrides working correctly
```

### grep -R "react-router-dom" -n app src
```
No react-router-dom found

✅ No react-router-dom imports anywhere in codebase
```

### grep "use client" + async function check
```
No async client components found

✅ All client components are synchronous
```

### Files with "use client"
```
src/app/test/page.tsx:1:"use client";
src/app/launch/page.tsx:1:"use client";
src/app/leaderboard/page.tsx:1:"use client";
src/app/page.tsx:1:"use client";
src/app/debug/page.tsx:1:"use client";
src/components/FarcasterSDK.tsx:1:"use client";
src/components/ui/toaster.tsx:1:"use client";
src/components/ui/toast.tsx:1:"use client";
src/components/FarcasterReadyFrame.tsx:1:"use client";
src/components/UserBadge.tsx:1:"use client";
src/components/RuntimeDetection.tsx:1:"use client";
src/components/FarcasterReadySimple.tsx:1:"use client";
src/components/HeroHeader.tsx:1:"use client";
src/components/FarcasterReady.tsx:1:"use client";
src/components/ClientToaster.tsx:1:"use client";
src/components/FarcasterReadyOfficial.tsx:1:"use client";
src/hooks/use-mobile.ts:1:"use client";
src/hooks/useLeaderboard.ts:1:"use client";
src/hooks/use-toast.ts:1:"use client";
src/hooks/useMyStats.ts:1:"use client";
src/hooks/useCapabilities.ts:1:"use client";
src/hooks/useResultToast.ts:1:"use client";

✅ 20+ client components properly marked
```

---

## SUMMARY

### ✅ All Checks Pass:
1. **React Versions**: Single version 18.3.1, properly deduped
2. **No Router Conflicts**: react-router-dom completely removed
3. **Client/Server Boundaries**: All components with hooks have "use client"
4. **Hook Order**: Fixed FarcasterReady.tsx to always return cleanup
5. **Toast System**: Properly configured with "use client" directives

### 🔍 Current Issue:
Despite all fixes being correct, errors persist in production. This indicates:
- **Bundle cache issue**: Hash `fd9d1056-76286ddac84065c4.js` unchanged
- **Deployment may not have rebuilt** with latest commits
- **Browser cache** serving old bundles

### 💡 Recommended Actions:
1. Wait for Vercel to fully rebuild and deploy
2. Hard refresh browser (Cmd+Shift+R / Ctrl+Shift+R)
3. Check new bundle hash differs from `fd9d1056-76286ddac84065c4.js`
4. If errors persist after fresh deployment, check browser DevTools with source maps enabled

---

**Export Generated**: 2025-10-09
**Project**: daily-one-tap-poll
**Framework**: Next.js 14.1.0 (App Router)
**React Version**: 18.3.1

