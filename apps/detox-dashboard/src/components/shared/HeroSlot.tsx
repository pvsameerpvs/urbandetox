"use client";

import Image from "next/image";
import { Badge } from "@urbandetox/ui";
import { Sparkles, Check, Trash2 } from "lucide-react";
import { ImageUpload } from "@/components/shared/ImageUpload";

interface HeroSlotProps {
  index: number;
  image: string;
  isActive: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onUpload: (img: string) => void;
}

export function HeroSlot({
  index,
  image,
  isActive,
  onSelect,
  onDelete,
  onUpload,
}: HeroSlotProps) {
  const hasImage = image && !image.startsWith("placeholder");

  return (
    <div
      className={`relative rounded-xl border-2 overflow-hidden transition-all ${
        isActive
          ? "border-brand shadow-lg shadow-brand/10 ring-2 ring-brand/20"
          : "border-border/40 hover:border-brand/30"
      }`}
    >
      {isActive && (
        <div className="absolute top-2 left-2 z-10 inline-flex items-center gap-1 bg-brand text-brand-foreground text-[10px] font-bold px-2 py-1 rounded-full shadow-sm">
          <Sparkles className="h-3 w-3" /> Live
        </div>
      )}

      {hasImage ? (
        <div className="relative aspect-[16/10] cursor-pointer group" onClick={onSelect}>
          <Image src={image} alt={`Hero option ${index + 1}`} fill className="object-cover" sizes="300px" unoptimized={image.startsWith("data:image")} />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
          <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            {!isActive && (
              <button
                onClick={(e) => { e.stopPropagation(); onSelect(); }}
                className="inline-flex items-center gap-1 rounded-full bg-white text-brand text-xs font-bold px-3 py-1.5 shadow-lg hover:bg-brand hover:text-brand-foreground transition-colors"
              >
                <Check className="h-3 w-3" /> Set as Live
              </button>
            )}
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(); }}
              className="inline-flex items-center gap-1 rounded-full bg-white text-red-500 text-xs font-bold px-3 py-1.5 shadow-lg hover:bg-red-500 hover:text-white transition-colors"
            >
              <Trash2 className="h-3 w-3" /> Remove
            </button>
          </div>
        </div>
      ) : (
        <div className="aspect-[16/10] p-3">
          <ImageUpload value="" onChange={onUpload} />
        </div>
      )}

      <div className="px-3 py-2 bg-white border-t border-border/20">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-muted-foreground">Slot {index + 1}</span>
          {isActive && <Badge className="bg-brand text-brand-foreground text-[10px] h-4 border-0">Selected</Badge>}
        </div>
      </div>
    </div>
  );
}
