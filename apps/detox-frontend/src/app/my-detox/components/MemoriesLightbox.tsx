"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { cn, safeImageUrl } from "@urbandetox/utils";
import { ChevronLeft, ChevronRight, X, ImageIcon } from "lucide-react";
import { Dialog, DialogContent, Button } from "@urbandetox/ui"

interface MemoriesLightboxProps {
  open: boolean;
  onClose: () => void;
  images: string[];
  title: string;
  packageSlug: string;
  destinationSlug: string;
}

export function MemoriesLightbox({
  open,
  onClose,
  images,
  title,
  packageSlug,
  destinationSlug,
}: MemoriesLightboxProps) {
  const [selected, setSelected] = useState(0);
  const validImages = images.filter(Boolean);
  const hasImages = validImages.length > 0;

  const prev = () => setSelected((s) => (s - 1 + validImages.length) % validImages.length);
  const next = () => setSelected((s) => (s + 1) % validImages.length);

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) onClose(); }}>
      <DialogContent className="max-w-3xl sm:max-w-4xl w-[calc(100vw-2rem)] p-0 overflow-hidden rounded-2xl" showCloseButton={false}>
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-20 rounded-full bg-black/40 p-2 text-white hover:bg-black/60 transition-colors"
          aria-label="Close memories"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex flex-col max-h-[85vh]">
          <div className="flex items-center gap-3 px-5 pt-5 pb-3">
            <div className="inline-flex items-center justify-center rounded-xl bg-brand/10 p-2 shrink-0">
              <ImageIcon className="h-4 w-4 text-brand" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-bold truncate">{title}</h3>
              <p className="text-xs text-muted-foreground">
                {hasImages ? `${validImages.length} memory${validImages.length === 1 ? "" : "ies"}` : "No memories yet"}
              </p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-5 pb-5">
            {!hasImages ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-secondary/50 mb-4">
                  <ImageIcon className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground max-w-xs">
                  Memories from your {title} trip will appear here once the gallery is updated.
                </p>
              </div>
            ) : (
              <>
                <div className="relative aspect-[16/9] rounded-xl overflow-hidden bg-secondary/30 mb-3 group">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={selected}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="absolute inset-0"
                    >
                      <Image
                        src={safeImageUrl(validImages[selected])}
                        alt={`Memory ${selected + 1}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 800px"
                      />
                    </motion.div>
                  </AnimatePresence>

                  {validImages.length > 1 && (
                    <>
                      <button
                        onClick={prev}
                        className="absolute left-2 top-1/2 -translate-y-1/2 z-10 rounded-full bg-black/40 p-2 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/60"
                        aria-label="Previous image"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </button>
                      <button
                        onClick={next}
                        className="absolute right-2 top-1/2 -translate-y-1/2 z-10 rounded-full bg-black/40 p-2 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/60"
                        aria-label="Next image"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </button>

                      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 rounded-full bg-black/40 px-3 py-1">
                        <span className="text-xs text-white font-medium">
                          {selected + 1} / {validImages.length}
                        </span>
                      </div>
                    </>
                  )}
                </div>

                <div className="grid grid-cols-5 sm:grid-cols-6 gap-2">
                  {validImages.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setSelected(i)}
                      className={cn(
                        "relative aspect-[16/10] overflow-hidden rounded-lg transition-all duration-200",
                        selected === i
                          ? "ring-2 ring-brand ring-offset-2"
                          : "opacity-60 hover:opacity-100"
                      )}
                    >
                      <Image
                        src={safeImageUrl(img)}
                        alt={`Thumbnail ${i + 1}`}
                        fill
                        className="object-cover"
                        sizes="120px"
                      />
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {packageSlug && destinationSlug && (
            <div className="border-t border-border/30 px-5 py-3 flex justify-end">
              <Button
                variant="outline"
                size="sm"
                className="rounded-xl border-border/60 h-9 px-4 text-xs font-medium"
                asChild
              >
                <Link href={`/detox/${destinationSlug}/${packageSlug}`}>
                  View Trip Details
                </Link>
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
