import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Enable React strict mode for better dev experience
  reactStrictMode: true,
  // Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    domains: [],
  },
}

export default nextConfig
