"use client";

import { Card, CardContent } from "@urbandetox/ui";
import { Route, Users, Armchair, IndianRupee } from "lucide-react";
import { formatPrice } from "@urbandetox/utils";

interface PackageStatsProps {
  departureCount: number;
  totalSeats: number;
  seatsBooked: number;
  totalRevenue: number;
}

export function PackageStats({ departureCount, totalSeats, seatsBooked, totalRevenue }: PackageStatsProps) {
  const fillRate = totalSeats > 0 ? Math.round((seatsBooked / totalSeats) * 100) : 0;

  const items = [
    {
      label: "Departures",
      value: String(departureCount),
      sub: `${fillRate}% fill rate`,
      icon: Route,
      color: "bg-brand/10 text-brand",
    },
    {
      label: "Total Seats",
      value: String(totalSeats),
      sub: `${totalSeats - seatsBooked} available`,
      icon: Armchair,
      color: "bg-blue-100 text-blue-700",
    },
    {
      label: "Seats Booked",
      value: String(seatsBooked),
      sub: fillRate >= 80 ? "High demand" : fillRate >= 50 ? "Good pace" : "Low bookings",
      icon: Users,
      color: "bg-emerald-100 text-emerald-700",
    },
    {
      label: "Total Revenue",
      value: formatPrice(totalRevenue),
      sub: "From confirmed bookings",
      icon: IndianRupee,
      color: "bg-purple-100 text-purple-700",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <Card key={item.label} className="border border-border/40 bg-white rounded-2xl">
            <CardContent className="p-4 flex items-center gap-3">
              <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${item.color}`}>
                <Icon className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="text-xl font-bold leading-none">{item.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{item.label}</p>
                <p className="text-[10px] text-muted-foreground/70 mt-0.5">{item.sub}</p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
