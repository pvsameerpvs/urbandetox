import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { fetchFeaturedPackages } from "@/lib/data";
import { getDestinationBySlug } from "@/data/destinations";
import { CloudRain, Sun, Waves, Calendar } from "lucide-react";

const seasonalMeta: Record<string, { icon: typeof Sun; color: string; label: string }> = {
  "Monsoon Detox": { icon: CloudRain, color: "text-blue-600", label: "Monsoon Detox" },
  "Summer Escape": { icon: Sun, color: "text-amber-600", label: "Summer Escape" },
  "Coastal Detox": { icon: Waves, color: "text-teal-600", label: "Coastal Detox" },
  "Weekend Detox": { icon: Calendar, color: "text-brand", label: "Weekend Detox" },
};

export function SeasonalSection() {
  const featured = fetchFeaturedPackages();
  const tags = Array.from(new Set(featured.map((p) => p.seasonalTag).filter(Boolean)));

  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 max-w-xl">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Seasonal Detox</h2>
          <p className="mt-2 text-muted-foreground">
            Pick a mood. We will match the destination and the season.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {tags.map((tag) => {
            const meta = tag ? seasonalMeta[tag] : null;
            const pkg = featured.find((p) => p.seasonalTag === tag);
            if (!meta || !pkg) return null;
            const dest = getDestinationBySlug(pkg.destinationSlug);
            return (
              <Link key={tag} href={`/detox`} className="group">
                <Card className="overflow-hidden border-border/60 bg-card transition-shadow hover:shadow-md">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={pkg.coverImage}
                      alt={tag}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-4 left-4 flex items-center gap-2 text-white">
                      <meta.icon className={`h-5 w-5 ${meta.color} drop-shadow`} />
                      <span className="text-sm font-medium drop-shadow">{meta.label}</span>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <p className="text-sm text-muted-foreground">
                      {dest?.name} · {pkg.durationLabel}
                    </p>
                    <p className="mt-1 text-sm font-medium text-foreground">{pkg.title}</p>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
