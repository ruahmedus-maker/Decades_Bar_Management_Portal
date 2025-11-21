/** @type {import('next').NextConfig} */
const nextConfig = {
  // Turbopack for development
  turbopack: {
    root: __dirname,
  },
  
  reactStrictMode: true,
  
  // Image configuration for Vercel
  images: {
    domains: [],
    unoptimized: false,
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  
  // IGNORE ALL ESLINT ERRORS DURING BUILD
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // FIX: Use a stable but unique build ID
  generateBuildId: async () => {
    // Use commit hash if available, fallback to timestamp
    if (process.env.VERCEL_GIT_COMMIT_SHA) {
      return `build-${process.env.VERCEL_GIT_COMMIT_SHA.slice(0, 8)}`;
    }
    // For local development, use a stable ID per day
    return `build-${new Date().toISOString().split('T')[0]}`;
  },
  
  // Cache busting
  async headers() {
    return [
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/manifest.json',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate',
          },
        ],
      },
    ];
  },
  
  trailingSlash: false,
  poweredByHeader: false,
}

module.exports = nextConfig;