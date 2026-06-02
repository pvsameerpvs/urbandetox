"use client";

import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@urbandetox/utils";
import {
  CalendarDays,
  Users,
  MapPin,
  ArrowRight,
  ExternalLink,
  Clock,
} from "lucide-react";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { cn } from "@urbandetox/utils";
import type { Departure, Package, Destination } from "@urbandetox/utils";
import {
  getFillPercentage,
  getSeatColor,
  getSeatTextColor,
  getTripStatusColor,
  getTripStatusDotColor,
  findRelatedData,
} from "./helpers";

interface DepartureRowProps {
  dep: Departure;
  packages: Package[];
  destinations: Destination[];
  onDeleteClick: (id: string) => void;
}

export function DepartureRow({ dep, packages, destinations, onDeleteClick }: DepartureRowProps) {
  const { pkg, dest } = findRelatedData(dep, packages, destinations);
  const fillPct = getFillPercentage(dep);

  return (
    <tr
      key={dep.id}
      className={cn(
        "border-b border-border/20 transition-colors",
        "hover:bg-brand/[0.02]"
      )}
    >
      {/* Departure: image + code */}
      <td className="px-4 py-3.5">
        <div className="flex items-center gap-3">
          <div className="relative h-10 w-14 rounded-lg overflow-hidden shrink-0 bg-secondary">
            {dep.image ? (
              <Image
                src={dep.image}
                alt={dep.code}
                fill
                className="object-cover"
                sizes="56px"
                unoptimized
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center">
                <span className="text-[10px] font-bold text-brand">
                  {dep.code.slice(0, 2)}
                </span>
              </div>
            )}
          </div>
          <div className="min-w-0">
            <p className="font-medium text-xs font-mono">{dep.code}</p>
            <p className="text-[10px] text-muted-foreground">{dep.id.slice(-6)}</p>
          </div>
        </div>
      </td>

      {/* Trip: package + destination */}
      <td className="px-4 py-3.5">
        <div className="min-w-0">
          <Link
            href={`/packages/${dep.packageSlug}`}
            className="text-xs font-medium truncate hover:text-brand transition-colors"
          >
            {pkg?.title || "—"}
          </Link>
          <div className="flex items-center gap-1 text-[10px] text-muted-foreground mt-0.5">
            <MapPin className="h-3 w-3" />
            <span className="truncate">{dest?.name || "—"}</span>
          </div>
        </div>
      </td>

      {/* Dates */}
      <td className="px-4 py-3.5">
        <div className="text-xs">
          <div className="flex items-center gap-1.5">
            <CalendarDays className="h-3 w-3 text-muted-foreground" />
            <span className="font-medium">{dep.startDate}</span>
          </div>
          <div className="flex items-center gap-1 text-[10px] text-muted-foreground mt-0.5">
            <ArrowRight className="h-3 w-3" />
            <span>{dep.endDate}</span>
          </div>
          {(dep.startTime || dep.endTime) && (
            <div className="flex items-center gap-1 text-[10px] text-muted-foreground mt-0.5">
              <Clock className="h-3 w-3" />
              <span>
                {dep.startTime || "—"}
                {dep.endTime ? ` → ${dep.endTime}` : ""}
              </span>
            </div>
          )}
        </div>
      </td>

      {/* Price */}
      <td className="px-4 py-3.5">
        <div className="text-xs">
          <p className="font-bold">{formatPrice(dep.offerPrice ?? dep.price)}</p>
          {dep.offerPrice && dep.offerPrice < dep.price && (
            <p className="text-[10px] text-muted-foreground line-through">
              {formatPrice(dep.price)}
            </p>
          )}
        </div>
      </td>

      {/* Seats */}
      <td className="px-4 py-3.5">
        <div className="space-y-1.5 min-w-[100px]">
          <div className="flex items-center gap-2 text-xs">
            <Users className="h-3 w-3 text-muted-foreground" />
            <span className={cn("font-medium", getSeatTextColor(dep))}>
              {dep.seatsLeft} left
            </span>
            <span className="text-[10px] text-muted-foreground">/ {dep.seatsTotal}</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-secondary overflow-hidden">
            <div
              className={cn("h-full rounded-full transition-all", getSeatColor(dep))}
              style={{ width: `${fillPct}%` }}
            />
          </div>
          <p className="text-[10px] text-muted-foreground">{fillPct}% filled</p>
        </div>
      </td>

      {/* Booking Status */}
      <td className="px-4 py-3.5">
        <StatusBadge status={dep.status} />
      </td>

      {/* Trip Outcome (internal) */}
      <td className="px-4 py-3.5">
        {dep.tripStatus ? (
          <span
            className={cn(
              "inline-flex items-center gap-1 text-[10px] font-semibold",
              getTripStatusColor(dep.tripStatus)
            )}
          >
            <span
              className={cn("h-2 w-2 rounded-full", getTripStatusDotColor(dep.tripStatus))}
            />
            <span className="capitalize">{dep.tripStatus}</span>
          </span>
        ) : (
          <span className="text-[10px] text-muted-foreground">—</span>
        )}
      </td>

      {/* Actions */}
      <td className="px-4 py-3.5 text-right">
        <div className="flex items-center justify-end gap-2">
          <Link
            href={`/departures/${dep.id}/edit`}
            className="inline-flex items-center gap-1 text-[10px] font-semibold text-brand hover:text-brand/80 transition-colors"
          >
            Edit <ExternalLink className="h-3 w-3" />
          </Link>
          <button
            onClick={() => onDeleteClick(dep.id)}
            className="text-[10px] text-red-500 hover:text-red-700 transition-colors px-1"
          >
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
}
