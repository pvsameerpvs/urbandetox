"use client";

import Image from "next/image";

interface HeroBackgroundProps {
  heroImage: string;
}

export function HeroBackground({ heroImage }: HeroBackgroundProps) {
  return (
    <div className="absolute inset-0">
      <Image
        src={heroImage || "https://images.unsplash.com/photo-1501555088652-021faa106b9b?q=80&w=2000&auto=format&fit=crop"}
        alt="Urban Detox - Nature escape"
        fill
        className="object-cover"
        priority
        quality={90}
        unoptimized={heroImage.startsWith("data:image")}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40" />
    </div>
  );
}
