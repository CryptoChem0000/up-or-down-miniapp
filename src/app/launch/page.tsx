import type { Metadata } from "next";

const baseUrl = process.env.APP_BASE_URL || "https://up-or-down-miniapp.vercel.app";

export const metadata: Metadata = {
  title: "Up or Down - Launch",
  description: "Launch the Up or Down Mini App",
  other: {
    // Farcaster Frame v2 JSON format for Mini App launch
    "fc:frame": JSON.stringify({
      version: "vNext",
      image: `${baseUrl}/hero.png`,
      button: {
        title: "Open App",
        action: "launch_frame",
        target: `${baseUrl}/`
      }
    }),
  },
};

export default function LaunchPage() {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-white mb-4">Up or Down</h1>
        <p className="text-gray-400 mb-8">Launch the Mini App to start predicting ETH price movements</p>
        <a 
          href="/" 
          className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition-colors"
        >
          Open Mini App
        </a>
      </div>
    </div>
  );
}
