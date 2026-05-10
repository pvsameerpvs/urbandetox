import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@urbandetox/ui", "@urbandetox/utils"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "**.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
