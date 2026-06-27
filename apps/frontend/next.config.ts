import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Enable React strict mode for catching subtle bugs during development
  reactStrictMode: true,

  // Output configuration for containerized deployments
  // output: 'standalone',

  // Image optimization — extend allowed domains as external services are added
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.ipfs.io',
      },
      {
        protocol: 'https',
        hostname: 'ipfs.io',
      },
    ],
  },

  // Experimental features for Next.js 15
  experimental: {
    // Optimize package imports to reduce bundle size
    optimizePackageImports: [
      'lucide-react',
      'recharts',
      'framer-motion',
      '@radix-ui/react-dialog',
      '@radix-ui/react-dropdown-menu',
      '@radix-ui/react-tabs',
    ],
  },
};

export default nextConfig;
