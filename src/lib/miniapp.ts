export function miniAppEmbedJSON(baseUrl: string) {
  return JSON.stringify({
    version: "1",
    imageUrl: `${baseUrl}/api/results/today/image`, // 3:2 image
    buttonTitle: "🚀 Start",
    postUrl: `${baseUrl}/api/vote`,
    splashImageUrl: `${baseUrl}/splash-200.png`,
    splashBackgroundColor: "#0b0b0b"
  });
}
