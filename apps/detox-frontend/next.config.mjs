/** @type {import('next').NextConfig} */
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
};

export default nextConfig;
