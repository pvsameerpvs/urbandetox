"use client";

import Link from "next/link";
import { Card, CardContent } from "@urbandetox/ui";
import type { LucideIcon } from "lucide-react";
import { MapPin, Package, CalendarDays, BookOpen, TrendingUp } from "lucide-react";
import { useAdminDestinations, useAdminPackages, useAdminDepartures } from "@/hooks/use-admin-data";

interface StatCardProps {
  label: string;
  value: string;
  change: string;
  icon: LucideIcon;
}

function StatCard({ label, value, change, icon: Icon }: StatCardProps) {
  return (
    <Card className="border-0 shadow-lg shadow-black/[0.03] bg-white rounded-2xl">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</p>
            <p className="text-2xl sm:text-3xl font-bold mt-1">{value}</p>
            <p className="text-xs text-emerald-600 font-medium mt-1 inline-flex items-center gap-1">
              <TrendingUp className="h-3 w-3" /> {change}
            </p>
          </div>
          <div className="rounded-xl bg-brand/10 p-2.5">
            <Icon className="h-5 w-5 text-brand" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function AdminDashboardPage() {
  const destinations = useAdminDestinations();
  const packages = useAdminPackages();
  const departures = useAdminDepartures();
  const upcoming = [...departures.filter((d) => d.status !== "closed")].sort((a, b) => a.startDate.localeCompare(b.startDate));
  const fillingFast = upcoming.filter((d) => d.status === "filling" || d.seatsLeft <= 3);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Overview of your detox business.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Destinations" value={String(destinations.length)} change="Live" icon={MapPin} />
        <StatCard label="Packages" value={String(packages.length)} change="Live" icon={Package} />
        <StatCard label="Upcoming Departures" value={String(upcoming.length)} change={`${fillingFast.length} filling fast`} icon={CalendarDays} />
        <StatCard label="Total Inventory" value={String(departures.length)} change="All time" icon={BookOpen} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-0 shadow-lg shadow-black/[0.03] bg-white rounded-2xl">
          <CardContent className="p-5 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold">Filling Fast</h3>
              <Link href="/departures" className="text-xs font-semibold text-brand hover:text-brand/80">View All</Link>
            </div>
            <div className="space-y-4">
              {fillingFast.slice(0, 5).map((d) => {
                const pkg = packages.find((p) => p.slug === d.packageSlug);
                const percent = Math.round(((d.seatsTotal - d.seatsLeft) / d.seatsTotal) * 100);
                return (
                  <div key={d.id}>
                    <div className="flex items-center justify-between mb-1.5">
                      <p className="text-sm font-medium">{pkg?.title || d.packageSlug}</p>
                      <p className="text-xs text-muted-foreground">{d.startDate}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-2 rounded-full bg-secondary overflow-hidden">
                        <div className="h-full bg-brand rounded-full" style={{ width: `${percent}%` }} />
                      </div>
                      <span className="text-xs font-medium text-amber-600 shrink-0">{d.seatsLeft}/{d.seatsTotal}</span>
                    </div>
                  </div>
                );
              })}
              {fillingFast.length === 0 && <p className="text-sm text-muted-foreground">No departures filling fast.</p>}
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg shadow-black/[0.03] bg-white rounded-2xl">
          <CardContent className="p-5 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold">Quick Links</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Link href="/destinations/new" className="rounded-xl border border-border/40 p-4 hover:border-brand/40 hover:bg-brand/[0.02] transition-colors">
                <p className="text-sm font-semibold">+ New Destination</p>
                <p className="text-xs text-muted-foreground mt-0.5">Add a new location</p>
              </Link>
              <Link href="/packages/new" className="rounded-xl border border-border/40 p-4 hover:border-brand/40 hover:bg-brand/[0.02] transition-colors">
                <p className="text-sm font-semibold">+ New Package</p>
                <p className="text-xs text-muted-foreground mt-0.5">Create a trip variant</p>
              </Link>
              <Link href="/departures/new" className="rounded-xl border border-border/40 p-4 hover:border-brand/40 hover:bg-brand/[0.02] transition-colors">
                <p className="text-sm font-semibold">+ New Departure</p>
                <p className="text-xs text-muted-foreground mt-0.5">Add trip dates</p>
              </Link>
              <Link href="/bookings" className="rounded-xl border border-border/40 p-4 hover:border-brand/40 hover:bg-brand/[0.02] transition-colors">
                <p className="text-sm font-semibold">View Bookings</p>
                <p className="text-xs text-muted-foreground mt-0.5">Customer bookings</p>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
