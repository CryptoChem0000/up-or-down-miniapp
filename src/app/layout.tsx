import type { Metadata } from "next";
import "./globals.css";
import ClientOnly from "@/components/ClientOnly";
import { ClientToaster } from "@/components/ClientToaster";
import FarcasterReady from "@/components/FarcasterReady";

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
        <ClientOnly>
          <FarcasterReady />
          {children}
          <ClientToaster />
        </ClientOnly>
      </body>
    </html>
  );
}
