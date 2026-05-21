"use client";

import Link from "next/link";
import { Card, CardContent } from "@urbandetox/ui";
import { formatPrice } from "@urbandetox/utils";
import {
  CalendarDays,
  Users,
  ArrowRight,
  ExternalLink,
  Route,
} from "lucide-react";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { cn } from "@urbandetox/utils";
import type { Departure } from "@urbandetox/utils";

interface PackageDeparturesProps {
  departures: Departure[];
}

export function PackageDepartures({ departures }: PackageDeparturesProps) {
  const sorted = [...departures].sort((a, b) => a.startDate.localeCompare(b.startDate));

  if (sorted.length === 0) {
    return (
      <Card className="border border-border/40 rounded-2xl bg-white">
        <CardContent className="p-12 text-center">
          <div className="h-12 w-12 rounded-xl bg-secondary/50 flex items-center justify-center mx-auto mb-4">
            <Route className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="text-base font-bold">No departures yet</h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-sm mx-auto">
            Add trip dates so customers can book this package.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border border-border/40 rounded-2xl bg-white overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/40 bg-secondary/[0.03]">
              <th className="text-left px-4 py-3 font-semibold text-[11px] uppercase tracking-wider text-muted-foreground">Code</th>
              <th className="text-left px-4 py-3 font-semibold text-[11px] uppercase tracking-wider text-muted-foreground">Dates</th>
              <th className="text-left px-4 py-3 font-semibold text-[11px] uppercase tracking-wider text-muted-foreground">Price</th>
              <th className="text-left px-4 py-3 font-semibold text-[11px] uppercase tracking-wider text-muted-foreground">Seats</th>
              <th className="text-left px-4 py-3 font-semibold text-[11px] uppercase tracking-wider text-muted-foreground">Status</th>
              <th className="text-right px-4 py-3 font-semibold text-[11px] uppercase tracking-wider text-muted-foreground">Action</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((dep) => {
              const fillPct = Math.round(((dep.seatsTotal - dep.seatsLeft) / dep.seatsTotal) * 100);
              const isFull = dep.status === "full";
              const isFilling = dep.status === "filling";
              return (
                <tr key={dep.id} className="border-b border-border/20 hover:bg-brand/[0.02] transition-colors">
                  <td className="px-4 py-3.5">
                    <p className="font-medium text-xs font-mono">{dep.code}</p>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="text-xs">
                      <div className="flex items-center gap-1.5">
                        <CalendarDays className="h-3 w-3 text-muted-foreground" />
                        <span className="font-medium">{dep.startDate}</span>
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-muted-foreground mt-0.5">
                        <ArrowRight className="h-3 w-3" /> {dep.endDate}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="text-xs">
                      <p className="font-bold">{formatPrice(dep.offerPrice ?? dep.price)}</p>
                      {dep.offerPrice && dep.offerPrice < dep.price && (
                        <p className="text-[10px] text-muted-foreground line-through">{formatPrice(dep.price)}</p>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="space-y-1.5 min-w-[100px]">
                      <div className="flex items-center gap-2 text-xs">
                        <Users className="h-3 w-3 text-muted-foreground" />
                        <span className={cn("font-medium", isFilling && "text-amber-600", isFull && "text-red-500")}>
                          {dep.seatsLeft} left
                        </span>
                        <span className="text-[10px] text-muted-foreground">/ {dep.seatsTotal}</span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-secondary overflow-hidden">
                        <div
                          className={cn("h-full rounded-full transition-all", isFull ? "bg-red-400" : isFilling ? "bg-amber-400" : "bg-emerald-400")}
                          style={{ width: `${fillPct}%` }}
                        />
                      </div>
                      <p className="text-[10px] text-muted-foreground">{fillPct}% filled</p>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <StatusBadge status={dep.status} />
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <Link href={`/departures/${dep.id}/edit`} className="inline-flex items-center gap-1 text-[10px] font-semibold text-brand hover:text-brand/80 transition-colors">
                      Edit <ExternalLink className="h-3 w-3" />
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}


