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
          // DO NOT set X-Frame-Options anywhere.
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self';",
              "img-src 'self' data: https:;",
              "style-src 'self' 'unsafe-inline';",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https:;",
              "connect-src 'self' https:;",
              // ✅ allow Warpcast to embed your app
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
