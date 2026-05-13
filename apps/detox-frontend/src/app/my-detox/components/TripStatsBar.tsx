
;
import { Plane, Mountain, Clock } from "lucide-react";
import { parseISO, startOfToday } from "date-fns";
import type { Trip } from "./TripCard";
import { Card, CardContent } from "@urbandetox/ui"

function getDaysUntil(startDate: string): number {
  const start = parseISO(startDate);
  const today = startOfToday();
  return Math.ceil((start.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

export function TripStatsBar({ trips }: { trips: Trip[] }) {
  const upcoming = trips.filter((t) => t.status === "upcoming");
  const completed = trips.filter((t) => t.status === "completed");
  const nextTrip = upcoming.sort((a, b) => parseISO(a.startDate).getTime() - parseISO(b.startDate).getTime())[0];
  const daysUntil = nextTrip ? getDaysUntil(nextTrip.startDate) : null;

  const stats = [
    { label: "Upcoming", value: upcoming.length, icon: Plane },
    { label: "Completed", value: completed.length, icon: Mountain },
    { label: "Next Trip", value: daysUntil !== null ? `${daysUntil}d` : "—", icon: Clock },
  ];

  return (
    <div className="grid grid-cols-3 gap-3 sm:gap-4">
      {stats.map((stat) => (
        <Card key={stat.label} className="border-0 shadow-lg shadow-black/[0.03] bg-white rounded-2xl">
          <CardContent className="p-4 sm:p-5 flex flex-col items-center text-center">
            <div className="mb-2 inline-flex items-center justify-center rounded-xl bg-brand/10 p-2.5">
              <stat.icon className="h-4 w-4 text-brand" />
            </div>
            <span className="text-xl sm:text-2xl font-bold">{stat.value}</span>
            <span className="text-xs text-muted-foreground font-medium mt-0.5">{stat.label}</span>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
