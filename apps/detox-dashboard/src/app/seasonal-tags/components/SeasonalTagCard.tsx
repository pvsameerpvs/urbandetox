"use client";

import Link from "next/link";
import {
  Pencil, Trash2, ArrowUpDown, Sun, CloudRain, Waves, Mountain,
  Snowflake, Moon, CloudSun, CloudLightning, Wind, Umbrella,
  TreePine, Flame, Leaf, Flower2, Heart, Star, Sparkles,
  Compass, MapPin, Tent, Anchor, Plane, Car, Bike,
  Camera, Music, Coffee, Sunrise, Sunset, ThermometerSun,
  Droplets, Bird, TreeDeciduous, CloudFog, PartyPopper,
  Gem, Crown, Award, Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@urbandetox/utils";
import type { SeasonalTag } from "@urbandetox/utils";

const ICONS: Record<string, LucideIcon> = {
  Sun, CloudRain, Waves, Mountain, Snowflake, Moon, CloudSun,
  CloudLightning, Wind, Umbrella, TreePine, Flame, Leaf, Flower2,
  Heart, Star, Sparkles, Compass, MapPin, Tent, Anchor, Plane,
  Car, Bike, Camera, Music, Coffee, Sunrise, Sunset, ThermometerSun,
  Droplets, Bird, TreeDeciduous, CloudFog, PartyPopper, Gem, Crown,
  Award, Zap,
};

function TagIcon({ name }: { name: string }) {
  const Icon = ICONS[name] || Sun;
  return <Icon className="h-6 w-6 text-brand" />;
}

interface SeasonalTagCardProps {
  tag: SeasonalTag;
  pkgCount: number;
  onDelete: (tag: SeasonalTag) => void;
}

export function SeasonalTagCard({ tag, pkgCount, onDelete }: SeasonalTagCardProps) {
  const hasPackages = pkgCount > 0;

  return (
    <div className="group relative bg-white rounded-2xl border border-border/40 shadow-sm shadow-black/[0.02] hover:shadow-lg hover:shadow-black/[0.04] hover:border-brand/20 transition-all duration-300 overflow-hidden">
      {/* Color accent bar */}
      <div className="h-1.5 bg-gradient-to-r from-brand/60 to-brand/30" />

      <div className="p-5">
        {/* Header: Icon + Name */}
        <div className="flex items-start gap-4">
          <div className="shrink-0 h-12 w-12 rounded-xl bg-brand/10 flex items-center justify-center">
            <TagIcon name={tag.iconName} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-base leading-tight truncate">{tag.name}</h3>
            <p className="text-xs text-muted-foreground mt-0.5">{tag.label}</p>
          </div>
        </div>

        {/* Meta info */}
        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Slug</span>
            <span className="font-mono text-muted-foreground/80 bg-secondary/50 px-1.5 py-0.5 rounded">{tag.slug}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Sort Order</span>
            <span className="font-medium text-muted-foreground flex items-center gap-1">
              <ArrowUpDown className="h-3 w-3" /> {tag.sortOrder}
            </span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Packages</span>
            <span className={cn(
              "font-semibold px-2 py-0.5 rounded-full text-[10px]",
              hasPackages
                ? "bg-brand/10 text-brand"
                : "bg-secondary text-muted-foreground"
            )}>
              {pkgCount} {pkgCount === 1 ? "package" : "packages"}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-5 pt-4 border-t border-border/30 flex items-center gap-2">
          <Link
            href={`/seasonal-tags/${tag.id}/edit`}
            className="flex-1 inline-flex items-center justify-center gap-1.5 h-9 rounded-lg bg-secondary/60 hover:bg-secondary text-xs font-semibold text-foreground transition-colors"
          >
            <Pencil className="h-3 w-3" /> Edit
          </Link>
          <button
            onClick={() => onDelete(tag)}
            className="flex-1 inline-flex items-center justify-center gap-1.5 h-9 rounded-lg bg-red-50 hover:bg-red-100 text-xs font-semibold text-red-600 transition-colors"
          >
            <Trash2 className="h-3 w-3" /> Delete
          </button>
        </div>
      </div>
    </div>
  );
}
