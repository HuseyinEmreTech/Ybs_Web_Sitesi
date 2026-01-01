import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  // swcMinify removed,
  compress: true,
  images: {
    // Replace '**' with explicit hostnames for external images.
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'cdn.example.com' },
      { protocol: 'https', hostname: 'cdn.sanity.io' },
      { protocol: 'https', hostname: 'ui-avatars.com' },
    ],
  },
  async headers() {
    return [
      {
        // Cache API responses for 60 seconds (matches ISR revalidate)
        source: '/api/:path*',
        headers: [
          { key: 'Cache-Control', value: 's-maxage=60, stale-while-revalidate=30' },
        ],
      },
    ];
  },
};

export default nextConfig;
