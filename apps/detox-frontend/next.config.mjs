/** @type {import('next').NextConfig} */
const API_TARGET = process.env.NEXT_PUBLIC_API_URL || "https://api.urbandetox.in";

/**
 * Every content image URL in Postgres points at the public R2 bucket. Kept in
 * an env var so swapping pub-*.r2.dev for a custom CDN domain later is a
 * Railway variable change rather than a code change.
 */
const R2_HOSTNAME =
  process.env.NEXT_PUBLIC_R2_HOSTNAME || "pub-f5b50eb029e5430db1a9767ba1ee3421.r2.dev";

const nextConfig = {
  transpilePackages: ["@urbandetox/ui", "@urbandetox/utils"],
  images: {
    /**
     * `unoptimized: true` used to be set here, which silently disabled the
     * whole pipeline: get-img-props returns srcSet and sizes as undefined when
     * unoptimized, so every `sizes` and `quality` prop in the app was inert and
     * a phone downloaded the same full-size desktop JPEG. Removing it requires
     * two things in the same change, or the site breaks: the R2 hostname below
     * (an unlisted host is a 400) and the `sharp` dependency (the optimizer
     * requires it lazily and throws E425 without it).
     */
    remotePatterns: [
      // R2 keys never carry a query string, so pin `search` to "". Omitting it
      // implies `**`, which would let anyone bounce arbitrary query strings
      // through /_next/image.
      { protocol: "https", hostname: R2_HOSTNAME, pathname: "/**", search: "" },
      // The remaining Unsplash URLs do carry ?q=&w=&auto=&fit=, so this pattern
      // has to leave `search` open or every one of them 400s.
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
    ],
    /**
     * Next's default is ['image/webp'], which is a losing trade on this
     * content: the hero frames are dense-foliage phone photos, and the LCP
     * frame re-encodes LARGER as WebP q75 (634 KB) than the 535 KB source
     * JPEG. AVIF at the same width is 303 KB. Browsers that do not send
     * image/avif in Accept still get the source format, resized.
     */
    formats: ["image/avif"],
    /**
     * Values not listed here are snapped to the nearest allowed one, so 55 has
     * to be declared or `quality={55}` silently becomes 75. Note the optimizer
     * subtracts 20 before handing quality to sharp's AVIF encoder
     * (image-optimizer.js: `Math.max(quality - 20, 1)`), so 55 here is AVIF
     * quality 35. 75 stays for everything that does not opt out.
     */
    qualities: [55, 75],
    // Sources top out at 2560px wide, so the default 2048 and 3840 rungs only
    // buy a full-size re-encode on 4K screens. 1440 matches the hero exactly.
    deviceSizes: [640, 750, 828, 1080, 1200, 1440, 1920],
    // r2.dev sends no Cache-Control at all, so this is the only thing setting
    // max-age on /_next/image responses, and the only thing stopping a
    // re-encode every 4 hours (the default).
    minimumCacheTTL: 2678400, // 31 days
    // Railway's disk is ephemeral; bound the cache rather than letting Next
    // claim half of whatever free space it sees at startup.
    maximumDiskCacheSize: 500_000_000,
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
