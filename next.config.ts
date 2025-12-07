import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'accounts-52.s3.us-east-1.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: 'irrdtpzqcwqeehmgdyzk.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
      }
    ],
  },
};

export default nextConfig;
