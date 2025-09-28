/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: { allowedOrigins: ['*'] }
  },
  transpilePackages: ['frames.js'],
  productionBrowserSourceMaps: false, // Don't ship client sourcemaps in production
  webpack: (config) => {
    config.experiments = {
      ...config.experiments,
      topLevelAwait: true,
    };
    return config;
  }
};
export default nextConfig;
