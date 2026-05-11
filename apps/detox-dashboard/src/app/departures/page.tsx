"use client";

import Link from "next/link";
import { Card } from "@urbandetox/ui";
import { Button } from "@urbandetox/ui";
import { formatPrice } from "@urbandetox/utils";
import { CalendarDays, Plus, Users, AlertCircle } from "lucide-react";
import { getPackageBySlug, getDestinationBySlug, deleteDeparture } from "@/lib/admin-data";
import { useAdminDepartures } from "@/hooks/use-admin-data";

export default function DeparturesPage() {
  const departures = useAdminDepartures().sort((a, b) => a.startDate.localeCompare(b.startDate));

  const handleDelete = (id: string) => {
    if (confirm("Delete this departure?")) {
      deleteDeparture(id);
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Departures</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage trip dates, availability, and pricing.</p>
        </div>
        <Button className="rounded-xl bg-brand text-brand-foreground hover:bg-brand/90 h-10 px-4 text-sm font-semibold shadow-lg shadow-brand/10" asChild>
          <Link href="/departures/new"><Plus className="mr-1.5 h-4 w-4" /> Add Dates</Link>
        </Button>
      </div>

      <Card className="border-0 shadow-lg shadow-black/[0.03] bg-white rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/40 bg-secondary/[0.03]">
                <th className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wider text-muted-foreground">Code</th>
                <th className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wider text-muted-foreground">Package</th>
                <th className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wider text-muted-foreground">Dates</th>
                <th className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wider text-muted-foreground">Price</th>
                <th className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wider text-muted-foreground">Seats</th>
                <th className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wider text-muted-foreground">Status</th>
                <th className="text-right px-4 py-3 font-semibold text-xs uppercase tracking-wider text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {departures.map((dep) => {
                const pkg = getPackageBySlug(dep.packageSlug);
                const dest = getDestinationBySlug(dep.destinationSlug);
                const isFull = dep.status === "full";
                const isFilling = dep.status === "filling";
                return (
                  <tr key={dep.id} className="border-b border-border/30 hover:bg-secondary/[0.02] transition-colors">
                    <td className="px-4 py-3 font-mono text-xs font-medium">{dep.code}</td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-xs">{pkg?.title}</p>
                      <p className="text-[10px] text-muted-foreground">{dest?.name}</p>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5 text-xs">
                        <CalendarDays className="h-3.5 w-3.5 text-muted-foreground" />
                        <span>{dep.startDate}</span>
                        <span className="text-muted-foreground">→</span>
                        <span>{dep.endDate}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-xs font-bold">{formatPrice(dep.offerPrice ?? dep.price)}</p>
                      {dep.offerPrice && dep.offerPrice < dep.price && (
                        <p className="text-[10px] text-muted-foreground line-through">{formatPrice(dep.price)}</p>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5 text-xs">
                        <Users className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className={isFilling ? "text-amber-600 font-medium" : isFull ? "text-red-500 font-medium" : ""}>
                          {dep.seatsLeft}/{dep.seatsTotal}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        dep.status === "open" ? "bg-emerald-100 text-emerald-700" :
                        dep.status === "filling" ? "bg-amber-100 text-amber-700" :
                        dep.status === "full" ? "bg-red-100 text-red-700" :
                        "bg-muted text-muted-foreground"
                      }`}>
                        {dep.status === "filling" && <AlertCircle className="h-3 w-3" />}
                        {dep.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="sm" className="h-7 text-xs" asChild>
                          <Link href={`/departures/${dep.id}/edit`}>Edit</Link>
                        </Button>
                        <button onClick={() => handleDelete(dep.id)} className="text-xs text-red-500 hover:text-red-700 transition-colors px-2">Delete</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
