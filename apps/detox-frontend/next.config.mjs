/** @type {import('next').NextConfig} */
const API_TARGET = process.env.NEXT_PUBLIC_API_URL || "https://api.urbandetox.in";

const nextConfig = {
  transpilePackages: ["@urbandetox/ui", "@urbandetox/utils"],
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${API_TARGET}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
