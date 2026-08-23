import { SeasonalRow } from "./SeasonalRow";
import type { LucideIcon } from "lucide-react";
import * as Icons from "lucide-react";
import type { Package, Destination } from "@urbandetox/utils";

function getIconComponent(name: string): LucideIcon {
  return (Icons as unknown as Record<string, LucideIcon>)[name] || Icons.Sun;
}

interface SeasonalGroup {
  tag: string;
  label: string;
  iconName: string;
  packages: Package[];
}

interface SeasonalSectionProps {
  groups: SeasonalGroup[];
  destMap: Map<string, Destination>;
}

export function SeasonalSection({ groups, destMap }: SeasonalSectionProps) {
  return (
    <section className="py-20 sm:py-28 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
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

        {groups.map(({ tag, label, iconName, packages }) => (
          <SeasonalRow
            tag={tag}
            key={tag}
            label={label}
            icon={getIconComponent(iconName)}
            packages={packages}
            destMap={destMap}
          />
        ))}
      </div>
    </section>
  );
}
