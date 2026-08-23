"use client";

import Image from "next/image";
import { ExternalLink } from "lucide-react";
import { safeImageUrl } from "@urbandetox/utils";

interface PickupMapBlockProps {
  mapImage?: string | null;
  mapUrl?: string | null;
  packageTitle: string;
}

export function PickupMapBlock({ mapImage, mapUrl, packageTitle }: PickupMapBlockProps) {
  if (!mapImage && !mapUrl) return null;

  return (
    <div className="mt-5 border-t border-border/50 pt-5">
      {mapImage && (
        <div className="relative mb-3 aspect-[16/9] overflow-hidden rounded-xl bg-secondary sm:aspect-[21/9]">
          <Image
            src={safeImageUrl(mapImage)}
            alt={`Pickup point map for ${packageTitle}`}
            fill
            sizes="(max-width: 768px) 100vw, 700px"
            className="object-cover"
          />
        </div>
      )}
      {mapUrl && (
        <a
          href={mapUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded text-sm font-semibold text-brand hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
        >
          Open pickup point in Maps <ExternalLink className="h-3.5 w-3.5" />
        </a>
      )}
    </div>
  );
}
