import { withPayload } from "@payloadcms/next/withPayload";
import vercelToolbarPlugin from "@vercel/toolbar/plugins/next";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  reactCompiler: true,
  experimental: {
    optimizePackageImports: [
      "framer-motion",
      "lucide-react",
    ],
    turbopackFileSystemCacheForDev: true,
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.ignoreWarnings = [{ module: /payload\/dist\/queues/ }];
    }
    return config;
  },
  // SEO: Consistent URL structure
  trailingSlash: false,
  // Image optimization for Core Web Vitals
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
      },
    ],
    // Optimize image quality for better performance
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
        ],
      },
    ]
  },
};

const withVercelToolbar = vercelToolbarPlugin();

export default withPayload(withVercelToolbar(nextConfig));
