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
  
  // Cache busting
  generateBuildId: async () => {
    return `build-${Date.now()}`;
  },
  
  // Clean headers
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
        source: '/images/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, must-revalidate',
          },
        ],
      },
      {
        source: '/icon-(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, must-revalidate',
          },
        ],
      },
    ];
  },
  
  trailingSlash: false,
  poweredByHeader: false,
}

module.exports = nextConfig;