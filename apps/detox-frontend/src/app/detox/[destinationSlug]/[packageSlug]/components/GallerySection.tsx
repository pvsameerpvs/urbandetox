"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { cn } from "@urbandetox/utils";

interface GallerySectionProps {
  images: string[];
  /** Used to describe the photos, instead of "Gallery main" and "Gallery 1". */
  destinationName: string;
}

export function GallerySection({ images, destinationName }: GallerySectionProps) {
  const [selected, setSelected] = useState(0);
  const validImages = images.filter(Boolean);

  if (validImages.length === 0) return null;

  return (
    <motion.section initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
      <div className="flex items-center gap-3 mb-5">
        <span className="h-px w-8 bg-brand/60" />
        <span className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">Gallery</span>
      </div>
      <h2 className="text-2xl sm:text-3xl font-bold mb-6">Visual <span className="text-brand">Journey</span></h2>

      <div className="space-y-3">
        <div className="relative aspect-[16/9] overflow-hidden rounded-2xl">
          <Image
            src={validImages[selected]}
            alt={`${destinationName}, photo ${selected + 1} of ${validImages.length}`}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 66vw"
          />
        </div>
        <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
          {validImages.map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setSelected(i)}
              /* The accessible name belongs on the control, not the image
                 inside it: a screen reader previously announced this as
                 "Gallery 1, button", which says nothing about what it does. */
              aria-label={`Show photo ${i + 1} of ${validImages.length}`}
              aria-current={selected === i}
              className={cn(
                "relative aspect-[16/10] overflow-hidden rounded-xl transition-all duration-300",
                selected === i ? "ring-2 ring-brand ring-offset-2" : "opacity-60 hover:opacity-100"
              )}
            >
              {/* Decorative: the button above carries the name. */}
              <Image src={img} alt="" fill className="object-cover" sizes="120px" />
            </button>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
