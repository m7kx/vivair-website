import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Enable React strict mode for better dev experience
  reactStrictMode: true,
  // Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [],
  },
}

export default nextConfig
