/** @type {import('next').NextConfig} */
const nextConfig = {
  // Turbopack for development (remove if causing issues in production)
  turbopack: {
    root: __dirname,
  },
  
  reactStrictMode: true,
  
  // Optimized image configuration for Vercel
  images: {
    domains: [],
    unoptimized: false, // Let Vercel handle optimization
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
  },
  
  // Build configuration
  eslint: {
    ignoreDuringBuilds: false, // Let's see actual ESLint errors
  },
  typescript: {
    ignoreBuildErrors: false, // Let's see TypeScript errors
  },
  
  // Clean cache headers
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
  
  // Enable trailing slashes for consistent URLs
  trailingSlash: false,
  
  // Disable powered by header for security
  poweredByHeader: false,
}

module.exports = nextConfig;