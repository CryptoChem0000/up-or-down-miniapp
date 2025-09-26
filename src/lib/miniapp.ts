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
