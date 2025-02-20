import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Enable React Strict Mode for better development practices
  reactStrictMode: true,

  // Configure environment variables
  env: {
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api',
  },

  // Configure rewrites to proxy API requests to the backend
  async rewrites() {
    return [
      {
        source: '/api/:path*', // Match any API route
        destination: `${process.env.NEXT_PUBLIC_API_BASE_URL}/:path*`, // Proxy to the backend
      },
    ];
  },

  // Configure images (if using Next.js Image Optimization)
  images: {
    domains: [''], // Add domains for external images
  },

  // Enable SWC minification (default in Next.js 12+)
  swcMinify: true,

  // Configure Webpack (optional)
  webpack(config) {
    // Add custom Webpack configurations here
    return config;
  },
};

export default nextConfig;