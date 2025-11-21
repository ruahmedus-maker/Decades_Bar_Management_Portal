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
  // Generate unique build ID
  generateBuildId: async () => {
    return `build-${Date.now()}`;
  },
  env: {
    NEXT_PUBLIC_BUILD_ID: `build-${Date.now()}`,
  },
  // Disable all caching
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