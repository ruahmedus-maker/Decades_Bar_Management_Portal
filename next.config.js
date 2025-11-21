/** @type {import('next').NextConfig} */
const nextConfig = {
  // Turbopack for development
  turbopack: {
    root: __dirname,
  },
  
  reactStrictMode: true,
  
  // Image configuration - fix for static assets
  images: {
    domains: ['example.com'],
    unoptimized: true,
    // Add this to prevent 401 errors
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  
  // Build configuration
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Force fresh builds
  generateBuildId: async () => {
    return `build-${Date.now()}`;
  },
  
  // Environment variables with build ID
  env: {
    NEXT_PUBLIC_BUILD_ID: `build-${Date.now()}`,
  },
  
  // Headers to fix 401 errors and cache issues
  async headers() {
    return [
      {
        // Apply to all routes
        source: '/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate, max-age=0',
          },
          {
            key: 'CDN-Cache-Control',
            value: 'no-cache'
          },
          {
            key: 'Vercel-CDN-Cache-Control',
            value: 'no-cache'
          }
        ],
      },
      {
        // Static assets - allow public access
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // Fix for image 401 errors
        source: '/images/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400',
          },
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
        ],
      },
      {
        // Fix for icon 401 errors
        source: '/icon-(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400',
          },
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
        ],
      },
    ];
  },
  
  // Enable trailing slash for better URL handling
  trailingSlash: false,
  
  // Disable compression to avoid caching issues
  compress: false,
  
  // Power your Vercel deployment
  poweredByHeader: false,
}

module.exports = nextConfig;