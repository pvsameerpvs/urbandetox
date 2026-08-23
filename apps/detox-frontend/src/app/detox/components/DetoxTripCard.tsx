import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock, Mountain, Users } from "lucide-react";
import {
  formatPrice,
  safeImageUrl,
  terrainLabel,
  type Destination,
  type Package,
} from "@urbandetox/utils";

interface DetoxTripCardProps {
  pkg: Package;
  dest?: Destination;
}

export function DetoxTripCard({ pkg, dest }: DetoxTripCardProps) {
  const href = dest ? `/detox/${dest.slug}/${pkg.slug}` : `/detox`;
  const terrains = (pkg.terrains ?? []).slice(0, 2);

  return (
    <Link
      href={href}
      className="group flex flex-col overflow-hidden rounded-2xl border-0 bg-white shadow-lg shadow-black/[0.03] transition-shadow hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
        <Image
          src={safeImageUrl(pkg.coverImage)}
          alt={pkg.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {pkg.seasonalTag && (
          <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-foreground backdrop-blur-sm">
            {pkg.seasonalTag}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        {dest && (
          <p className="mb-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
            {dest.name}
          </p>
        )}
        <h3 className="text-base font-bold leading-snug">{pkg.title}</h3>
        <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">{pkg.subtitle}</p>

        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" /> {pkg.durationLabel}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5" /> {pkg.groupSize} max
          </span>
          {terrains.length > 0 && (
            <span className="inline-flex items-center gap-1.5">
              <Mountain className="h-3.5 w-3.5" />
              {terrains.map(terrainLabel).join(", ")}
            </span>
          )}
        </div>

        <div className="mt-auto flex items-end justify-between pt-5">
          <div>
            <p className="text-[11px] text-muted-foreground">From</p>
            <p className="text-lg font-bold text-brand">{formatPrice(pkg.startingPrice)}</p>
          </div>
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-brand">
            View Trip <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}
