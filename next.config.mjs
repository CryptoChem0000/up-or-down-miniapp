/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: { allowedOrigins: ['*'] }
  },
  transpilePackages: ['frames.js'],
  productionBrowserSourceMaps: false, // Don't ship client sourcemaps in production
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          // Do NOT set X-Frame-Options at all (SAMEORIGIN/DENY will block Warpcast)
          // If you previously set it, remove it.

          // Allow Warpcast (and your own origin) to embed the app
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self';",
              "img-src 'self' data: https:;",
              "style-src 'self' 'unsafe-inline';",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https:;",
              "connect-src 'self' https:;",
              // IMPORTANT: allow embedding in Warpcast
              "frame-ancestors 'self' https://warpcast.com https://*.warpcast.com;",
            ].join(" "),
          },
        ],
      },
    ];
  },
  webpack: (config) => {
    config.experiments = {
      ...config.experiments,
      topLevelAwait: true,
    };
    return config;
  }
};
export default nextConfig;
