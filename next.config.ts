import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
   eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: [
      'api.betpayapp.com',
      'api.blaffa.net',
      // Add other domains as needed
    ],
  },
};

export default nextConfig;
