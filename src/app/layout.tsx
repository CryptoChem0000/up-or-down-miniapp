import type { Metadata } from "next";
import "./globals.css";
import { miniAppEmbedJSON } from "@/lib/miniapp";
import { ClientToaster } from "@/components/ClientToaster";
import FarcasterReadyFrame from "@/components/FarcasterReadyFrame";

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
    "fc:frame": JSON.stringify({
      version: "next",
      imageUrl: `${baseUrl}/api/results/today/image`,
      button: {
        title: "🚀 Start",
        action: {
          type: "post"
        }
      },
      postUrl: `${baseUrl}/api/vote`
    }),
    "og:title": "Ethereum",
    "og:description": "Predict ETH daily. Win streak multipliers.",
    "og:image": `${baseUrl}/api/results/today/image`,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
                <FarcasterReadyFrame />
        {children}
        <ClientToaster />
      </body>
    </html>
  );
}
