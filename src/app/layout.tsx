import type { Metadata } from "next";
import "./globals.css";
import dynamic from "next/dynamic";
import ClientOnly from "@/components/ClientOnly";
import { ClientToaster } from "@/components/ClientToaster";
import SessionBootstrap from "@/app/_providers/SessionBootstrap";

const SessionProvider = dynamic(() => import("@/components/SessionProvider"), { ssr: false });

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
  openGraph: {
    title: "Ethereum",
    description: "Predict ETH daily. Win streak multipliers.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Up or Down - Ethereum Price Prediction Game",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ethereum",
    description: "Predict ETH daily. Win streak multipliers.",
    images: ["/og-image.png"],
  },
  other: {
    "fc:miniapp": JSON.stringify({
      version: "1",
      imageUrl: `${baseUrl}/og-image.png`,
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
    "og:image": `${baseUrl}/og-image.png`,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SessionBootstrap />
        <ClientOnly>
          <SessionProvider>
            {children}
          </SessionProvider>
          <ClientToaster />
        </ClientOnly>
      </body>
    </html>
  );
}
