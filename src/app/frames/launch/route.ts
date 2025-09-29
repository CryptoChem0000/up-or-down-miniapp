import { frames } from "frames.js/next";

const base = process.env.APP_BASE_URL || "https://up-or-down-miniapp.vercel.app";

export const GET = frames(async () => {
  return {
    image: `${base}/hero.png`,
    buttons: [
      {
        label: "Open App",
        action: "launch_frame",        // ✅ required for Mini App launch
        target: `${base}/`             // ✅ your Mini App entrypoint
      }
    ],
  };
});
