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
      ...config.experiments, // ← fix: spread the existing properly
      topLevelAwait: true,
    };
    return config;
  }
};
export default nextConfig;
