/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    root: __dirname,
  },
  reactStrictMode: true,
  images: {
    domains: ['example.com'],
    unoptimized: true
  },
  output: 'export',
  trailingSlash: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Generate unique build ID that persists across deployments
  generateBuildId: async () => {
    // Use a timestamp that only changes on actual builds, not page loads
    return `build-${Math.floor(Date.now() / 60000)}`; // Changes every minute
  },
  env: {
    // This will be set during build time, not runtime
    NEXT_PUBLIC_BUILD_ID: process.env.NEXT_PUBLIC_BUILD_ID || `build-${Math.floor(Date.now() / 60000)}`,
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate, max-age=0',
          },
        ],
      },
    ];
  },
  experimental: {
    staleTimes: {
      dynamic: 0,
      static: 0,
    },
  },
}

module.exports = nextConfig;