import { createFrames } from "frames.js/next";

const base = process.env.APP_BASE_URL || "https://up-or-down-miniapp.vercel.app";

const frames = createFrames();

export const GET = frames(async () => {
  return {
    image: `${base}/hero.png`,
    buttons: [
      {
        label: "Open App",
        action: "launch_frame",        // Use launch_frame action for Mini App launch
        target: `${base}/`             // ✅ your Mini App entrypoint
      }
    ],
  };
});
