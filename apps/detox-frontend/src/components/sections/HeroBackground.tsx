"use client";

import Image from "next/image";
import { useHeroRotation } from "./use-hero-rotation";

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
  // No stock-photo fallback: an empty set renders the dark ground alone, which
  // is better than flashing an unrelated image before the real one arrives.

  const { index, live, jumpTo, markReady } = useHeroRotation(ordered.length);

  return (
    <div className="absolute inset-0 bg-[var(--hero-ground)]">
      {ordered.map((src, i) =>
        live.includes(i) ? (
          <Image
            key={`${i}-${src}`}
            src={src}
            alt=""
            fill
            // Correct for a full-bleed hero, and currently inert: with
            // `images.unoptimized` set, generateImgAttrs returns
            // `{ src, srcSet: undefined, sizes: undefined }`, so no `sizes`
            // attribute is emitted. It starts working the moment the
            // optimizer is turned back on.
            sizes="100vw"
            // 55 becomes AVIF q35 after the optimizer subtracts 20. Checked at
            // 1:1 against the source: safe here because a black/40-to-85
            // gradient sits over the whole frame.
            quality={55}
            // Next 16 deprecated `priority` in favour of `preload`: "Starting
            // with Next.js 16, the `priority` property has been deprecated in
            // favor of the `preload` property in order to make the behavior
            // clear." `preload` emits the <link rel="preload" as="image">, and
            // ImagePreload spreads fetchPriority onto that link, so the LCP
            // frame is requested High rather than at the browser's default for
            // images. Passing both is supported; only preload+priority and
            // preload+loading="lazy" throw.
            preload={i === 0}
            fetchPriority={i === 0 ? "high" : undefined}
            // Frames past 0 only ever mount client-side, so the preload scanner
            // never sees them. `eager` just stops Next stamping loading="lazy",
            // which is a no-op lie for an inset-0 element.
            loading={i === 0 ? undefined : "eager"}
            // `sync` would put a 1440x1920 decode on the main thread in the
            // LCP frame. Next also awaits img.decode() before firing onLoad,
            // so the fade below is already decode-safe.
            decoding="async"
            // Only fade to a frame whose bitmap is ready.
            onLoad={() => markReady(i)}
            unoptimized={src.startsWith("data:image")}
            // `visibility` rides the same transition so a faded-out frame stops
            // being painted (no composited layer, no retained decode) without
            // leaving the DOM — leaving would refetch on the next cycle, since
            // R2 sends no Cache-Control.
            className={`object-cover transition-[opacity,visibility] duration-1000 ease-in-out ${
              i === index ? "visible opacity-100" : "invisible opacity-0"
            }`}
          />
        ) : null
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40" />

      {ordered.length > 1 && (
        <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 gap-1.5">
          {ordered.map((src, i) => (
            <button
              key={`${i}-${src}`}
              type="button"
              onClick={() => jumpTo(i)}
              aria-label={`Show hero image ${i + 1} of ${ordered.length}`}
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
