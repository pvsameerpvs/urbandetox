"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const FALLBACK =
  "https://images.unsplash.com/photo-1501555088652-021faa106b9b?q=80&w=2000&auto=format&fit=crop";

const ROTATE_MS = 6000;

interface HeroBackgroundProps {
  /** All configured hero images. One is fine; more will cross-fade. */
  images: string[];
  /** Which image to start on. */
  startIndex?: number;
}

export function HeroBackground({ images, startIndex = 0 }: HeroBackgroundProps) {
  const slides = images.filter(Boolean);
  const ordered =
    slides.length > 1 && startIndex > 0
      ? [...slides.slice(startIndex), ...slides.slice(0, startIndex)]
      : slides;
  const shown = ordered.length > 0 ? ordered : [FALLBACK];

  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (shown.length < 2) return;
    // Respect a reduced-motion preference by not auto-advancing at all.
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const id = window.setInterval(
      () => setIndex((i) => (i + 1) % shown.length),
      ROTATE_MS
    );
    return () => window.clearInterval(id);
  }, [shown.length]);

  return (
    <div className="absolute inset-0">
      {shown.map((src, i) => (
        <Image
          key={src}
          src={src}
          alt=""
          aria-hidden={i !== index}
          fill
          // Only the first frame is a priority load; the rest stream in behind it.
          priority={i === 0}
          quality={90}
          sizes="100vw"
          unoptimized={src.startsWith("data:image")}
          className={`object-cover transition-opacity duration-1000 ease-in-out ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40" />

      {shown.length > 1 && (
        <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 gap-1.5">
          {shown.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Show hero image ${i + 1} of ${shown.length}`}
              aria-current={i === index}
              className={`h-1.5 rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 ${
                i === index ? "w-6 bg-white/90" : "w-1.5 bg-white/40 hover:bg-white/70"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
