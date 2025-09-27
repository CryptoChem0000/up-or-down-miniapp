import type { Metadata } from "next";
import "./globals.css";
import { miniAppEmbedJSON } from "@/lib/miniapp";
import { ClientToaster } from "@/components/ClientToaster";

const baseUrl = process.env.APP_BASE_URL || "http://localhost:3010";

export const metadata: Metadata = {
  title: "Daily ETH Poll",
  description: "Predict ETH daily. Win streak multipliers.",
  other: {
    "fc:miniapp": miniAppEmbedJSON(baseUrl),
    "fc:frame": miniAppEmbedJSON(baseUrl),
    "og:title": "Daily ETH Poll",
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
