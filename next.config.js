/** @type {import('next').NextConfig} */
const nextConfig = {
  // Turbopack for development
  turbopack: {
    root: __dirname,
  },
  
  reactStrictMode: true,
  
  // COMPLETELY disable image optimization
  images: {
    unoptimized: true,
    domains: [],
    // Explicitly disable remote images
    remotePatterns: [],
    // Disable all image optimization features
    dangerouslyAllowSVG: false,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  
  // IGNORE ALL ESLINT ERRORS DURING BUILD
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Stable build ID
  generateBuildId: async () => {
    if (process.env.VERCEL_GIT_COMMIT_SHA) {
      return `build-${process.env.VERCEL_GIT_COMMIT_SHA.slice(0, 8)}`;
    }
    return `build-${new Date().toISOString().split('T')[0]}`;
  },
  
  // Cache headers - ADD BLOCK for _next/image
  async headers() {
    return [
      {
        source: '/_next/image',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate',
          },
        ],
      },
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
        source: '/(.*)\\.(ico|png|jpg|jpeg|webp|svg)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, must-revalidate',
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