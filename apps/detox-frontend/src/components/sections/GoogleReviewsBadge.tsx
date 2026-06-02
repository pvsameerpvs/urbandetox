"use client";

import { Star, ExternalLink } from "lucide-react";
import { cn } from "@urbandetox/utils";

interface GoogleReviewsBadgeProps {
  rating: number;
  total: number;
  url: string;
}

export function GoogleReviewsBadge({ rating, total, url }: GoogleReviewsBadgeProps) {
  if (!url) return null;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "inline-flex items-center gap-3 rounded-2xl border border-border/60",
        "bg-white px-4 py-3 shadow-sm hover:shadow-md transition-shadow",
        "text-left group"
      )}
    >
      <div className="flex flex-col">
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`h-3.5 w-3.5 ${
                i < Math.round(rating) ? "fill-amber-400 text-amber-400" : "text-muted"
              }`}
            />
          ))}
        </div>
        <span className="text-xs text-muted-foreground mt-0.5">
          {rating.toFixed(1)} · {total} Google reviews
        </span>
      </div>
      <ExternalLink className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
    </a>
  );
}
