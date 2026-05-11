import { fetchFeaturedPackages } from "@/lib/data";
import { SeasonalRow } from "./SeasonalRow";
import type { LucideIcon } from "lucide-react";
import * as Icons from "lucide-react";
import { initialSeasonalTags } from "@urbandetox/utils";

function getIconComponent(name: string): LucideIcon {
  return (Icons as unknown as Record<string, LucideIcon>)[name] || Icons.Sun;
}

export function SeasonalSection() {
  const featured = fetchFeaturedPackages();

  const tags = Array.from(new Set(featured.map((p) => p.seasonalTag).filter((t): t is string => !!t)));

  const grouped = tags
    .map((tag) => {
      const meta = initialSeasonalTags.find((t) => t.name === tag);
      return {
        tag,
        label: meta?.label || tag,
        icon: meta ? getIconComponent(meta.iconName) : Icons.Sun,
        packages: featured.filter((p) => p.seasonalTag === tag),
      };
    })
    .filter((g) => g.packages.length > 0);

  return (
    <section className="py-20 sm:py-28 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-16 mb-12 sm:mb-16">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px w-10 bg-brand" />
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-brand">By Experience</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.1]">
              Find Your <span className="text-brand">Mood</span>
            </h2>
          </div>
          <div className="lg:flex lg:items-end">
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed lg:max-w-md">
              Summer lakes, monsoon forests, coastal sunsets, or deep mountain immersions. Pick the rhythm that calls you.
            </p>
          </div>
        </div>

        {/* Rows */}
        {grouped.map(({ tag, label, icon, packages }) => (
          <SeasonalRow key={tag} label={label} icon={icon} packages={packages} />
        ))}
      </div>
    </section>
  );
}
