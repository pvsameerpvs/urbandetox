"use client";

import { Card, CardContent } from "@urbandetox/ui";
import { MapPin, Package, CalendarDays, BookOpen, TrendingUp, Users } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string;
  change: string;
  icon: typeof MapPin;
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
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Overview of your detox business.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Destinations" value="4" change="+1 this month" icon={MapPin} />
        <StatCard label="Packages" value="8" change="+3 this month" icon={Package} />
        <StatCard label="Upcoming Departures" value="22" change="12 filling fast" icon={CalendarDays} />
        <StatCard label="Total Bookings" value="156" change="+23 this month" icon={BookOpen} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-0 shadow-lg shadow-black/[0.03] bg-white rounded-2xl">
          <CardContent className="p-5 sm:p-6">
            <h3 className="text-base font-bold mb-4">Recent Bookings</h3>
            <div className="space-y-3">
              {[
                { name: "Rahul Sharma", trip: "Kashmir 3-Day", date: "Jun 20, 2026", amount: "₹28,500", status: "Paid" },
                { name: "Priya Menon", trip: "Kodai 5-Day", date: "Apr 18, 2026", amount: "₹12,500", status: "Paid" },
                { name: "Arun Kumar", trip: "Gokarna 3-Day", date: "Apr 25, 2026", amount: "₹9,500", status: "Pending" },
                { name: "Sneha Patel", trip: "Kashmir 15-Day", date: "Jun 1, 2026", amount: "₹78,500", status: "Paid" },
              ].map((b, i) => (
                <div key={i} className="flex items-center justify-between py-2.5 border-b border-border/30 last:border-0">
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{b.name}</p>
                    <p className="text-xs text-muted-foreground">{b.trip} · {b.date}</p>
                  </div>
                  <div className="text-right shrink-0 ml-4">
                    <p className="text-sm font-bold">{b.amount}</p>
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${b.status === "Paid" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>{b.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg shadow-black/[0.03] bg-white rounded-2xl">
          <CardContent className="p-5 sm:p-6">
            <h3 className="text-base font-bold mb-4">Filling Fast</h3>
            <div className="space-y-4">
              {[
                { trip: "Kashmir 3-Day", date: "Jul 25", seats: "3/10 left", percent: 70 },
                { trip: "Kodai 5-Day", date: "Jun 20", seats: "2/12 left", percent: 83 },
                { trip: "North Kerala", date: "Jul 5", seats: "3/10 left", percent: 70 },
              ].map((d, i) => (
                <div key={i}>
                  <div className="flex items-center justify-between mb-1.5">
                    <p className="text-sm font-medium">{d.trip}</p>
                    <p className="text-xs text-muted-foreground">{d.date}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-2 rounded-full bg-secondary overflow-hidden">
                      <div className="h-full bg-brand rounded-full" style={{ width: `${d.percent}%` }} />
                    </div>
                    <span className="text-xs font-medium text-amber-600 shrink-0">{d.seats}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
