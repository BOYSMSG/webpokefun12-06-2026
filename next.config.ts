import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  async redirects() {
    return [
      {
        source: '/store/:path*',
        destination: 'https://store.pokefun.in',
        permanent: true,
      },
      {
        source: '/store',
        destination: 'https://store.pokefun.in',
        permanent: true,
      }
    ]
  }
};

export default nextConfig;
