"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Button } from "@urbandetox/ui";
import { Plus, X } from "lucide-react";

interface GalleryUploadProps {
  items: string[];
  onAdd: (value: string) => void;
  onRemove: (index: number) => void;
  maxSizeMB?: number;
}

export function GalleryUpload({ items, onAdd, onRemove, maxSizeMB = 5 }: GalleryUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFile = (file: File) => {
    setError(null);
    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`Image too large. Max ${maxSizeMB}MB.`);
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      onAdd(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const visibleItems = items.filter(Boolean);

  return (
    <div className="space-y-3">
      {visibleItems.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {items.map((item, i) => {
            if (!item) return null;
            const isValid = item.startsWith("http") || item.startsWith("data:image");
            return (
              <div key={i} className="relative aspect-[4/3] rounded-xl overflow-hidden border border-border/40 group">
                {isValid ? (
                  <Image src={item} alt={`Gallery ${i + 1}`} fill sizes="200px" className="object-cover" unoptimized />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-secondary/20 text-xs text-muted-foreground">Invalid</div>
                )}
                <button
                  type="button"
                  onClick={() => onRemove(i)}
                  className="absolute top-1.5 right-1.5 h-6 w-6 rounded-full bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            );
          })}
        </div>
      )}
      <div className="flex items-center gap-3">
        <Button type="button" variant="outline" size="sm" className="rounded-lg h-9 text-xs" onClick={() => inputRef.current?.click()}>
          <Plus className="h-3.5 w-3.5 mr-1" /> Add Image
        </Button>
        {visibleItems.length === 0 && <p className="text-xs text-muted-foreground">No images yet</p>}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = "";
        }}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
