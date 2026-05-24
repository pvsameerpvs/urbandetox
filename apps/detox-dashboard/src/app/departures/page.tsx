"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Button } from "@urbandetox/ui";
import {
  Plus,
  Route,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Clock,
  Users,
  Search,
} from "lucide-react";
import { deleteDeparture } from "@/lib/admin-data";
import { useAdminDepartures, useAdminPackages, useAdminDestinations } from "@/hooks/use-admin-data";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { toast } from "sonner";
import { DepartureTable } from "./components/DepartureTable";
import { SimpleStatCard } from "@/components/ui/SimpleStatCard";
import { computeDepartureStats, filterDepartures } from "./lib/departure-helpers";

export default function DeparturesPage() {
  const { data: allDepartures } = useAdminDepartures();
  const { data: packages } = useAdminPackages();
  const { data: destinations } = useAdminDestinations();
  const [search, setSearch] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingId, setPendingId] = useState<string | null>(null);

  const filtered = useMemo(
    () => filterDepartures(allDepartures, search, packages, destinations),
    [allDepartures, search, packages, destinations]
  );

  const stats = useMemo(() => computeDepartureStats(allDepartures), [allDepartures]);

  const handleDeleteClick = (id: string) => {
    setPendingId(id);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!pendingId) return;
    try {
      await deleteDeparture(pendingId);
      toast.success("Departure deleted successfully");
      setTimeout(() => window.location.reload(), 400);
    } catch {
      toast.error("Failed to delete departure");
    }
    setConfirmOpen(false);
    setPendingId(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Departures</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage trip dates, availability, and pricing.
          </p>
        </div>
        <Button
          className="rounded-xl bg-brand text-brand-foreground hover:bg-brand/90 h-10 px-4 text-sm font-semibold shadow-lg shadow-brand/10"
          asChild
        >
          <Link href="/departures/new">
            <Plus className="mr-1.5 h-4 w-4" /> Add Dates
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <SimpleStatCard
          value={stats.total}
          label="Total Departures"
          icon={<Route className="h-5 w-5 text-brand" />}
          bgClass="bg-brand/10"
        />
        <SimpleStatCard
          value={stats.open}
          label="Open"
          icon={<CheckCircle2 className="h-5 w-5 text-emerald-700" />}
          bgClass="bg-emerald-100"
        />
        <SimpleStatCard
          value={stats.filling}
          label="Filling Fast"
          icon={<AlertCircle className="h-5 w-5 text-amber-700" />}
          bgClass="bg-amber-100"
        />
        <SimpleStatCard
          value={stats.full}
          label="Fully Booked"
          icon={<XCircle className="h-5 w-5 text-red-700" />}
          bgClass="bg-red-100"
        />
        <SimpleStatCard
          value={stats.closed}
          label="Closed"
          icon={<Clock className="h-5 w-5 text-gray-600" />}
          bgClass="bg-gray-100"
        />
        <SimpleStatCard
          value={stats.totalSeats}
          label="Total Seats"
          icon={<Users className="h-5 w-5 text-purple-700" />}
          bgClass="bg-purple-100"
        />
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search by code, package, destination..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full h-11 pl-10 pr-4 rounded-xl border border-border/40 bg-white text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand/20"
        />
      </div>

      {/* Table */}
      <DepartureTable
        departures={filtered}
        packages={packages}
        destinations={destinations}
        onDeleteClick={handleDeleteClick}
      />

      <ConfirmDialog
        open={confirmOpen}
        title="Delete Departure"
        description="This will permanently remove this trip departure. This action cannot be undone."
        confirmLabel="Delete"
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setConfirmOpen(false);
          setPendingId(null);
        }}
      />
    </div>
  );
}
