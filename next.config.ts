import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Only enable static export for production builds
  ...(process.env.NODE_ENV === 'production' && {
    output: 'export',
    images: {
      unoptimized: true, // Required for static export
    },
  }),
  distDir: 'dist',
  images: {
    domains: [
      'api.betpayapp.com',
      'api.blaffa.net',
      // Add other domains as needed
    ],
  },
  // Add basePath if your app is not deployed at the root of the domain
  // basePath: '/your-base-path',
};

export default nextConfig;