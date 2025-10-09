/** @type {import('next').NextConfig} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1a365d',
        secondary: '#2d3748',
        accent: '#d4af37',
        success: '#38a169',
      }
    },
  },
  plugins: [],
}
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['example.com'],
  },
}

module.exports = nextConfig

