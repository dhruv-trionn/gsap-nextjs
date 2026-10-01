import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: 'images.unsplash.com',
      },
      {
        hostname: 'picsum.photos',
      },
    ],
  },
  // @ts-ignore - 'allowedDevOrigins' is an experimental feature in Next.js 15.5.2
  allowedDevOrigins: ['*'],

  /* config options here */
};

export default nextConfig;
