import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',  // Enable static exports
  distDir: 'dist',
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,  // Required for static export
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
