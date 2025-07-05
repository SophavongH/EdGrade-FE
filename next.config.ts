import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ik.imagekit.io',
        pathname: '/**',
      },
    ],
  },
  i18n: {
    locales: ['en', 'kh'],
    defaultLocale: 'en',
  },
};

export default nextConfig;
