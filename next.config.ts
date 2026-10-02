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
  async redirects() {
    return [
      {
        source: '/news',
        destination: '/careers',
        permanent: true,
      },
      {
        source: '/news/:slug',
        destination: '/careers',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
