/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    root: __dirname,
  },
  reactStrictMode: true,
  images: {
    domains: ['example.com'],
  },
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  }
  
}

module.exports = nextConfig