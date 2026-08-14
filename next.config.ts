import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Allow images from any origin. Product/news/blog images are authored in the
    // admin CMS, so their host can change at any time without a redeploy here —
    // an allow-list would silently 400 in the optimizer whenever a new CDN is used.
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;
