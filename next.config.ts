import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Skip ESLint during build — ESLint 9 requires flat config (eslint.config.js)
  // TODO: migrate .eslintrc.json → eslint.config.mjs for ESLint 9
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [],
  },
}

export default nextConfig
