"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Card, CardContent, Button } from "@urbandetox/ui";
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
import { getPackageBySlug, getDestinationBySlug, deleteDeparture } from "@/lib/admin-data";
import { useAdminDepartures } from "@/hooks/use-admin-data";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { toast } from "sonner";
import { DepartureTable } from "./components/DepartureTable";

export default function DeparturesPage() {
  const allDepartures = useAdminDepartures();
  const [search, setSearch] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingId, setPendingId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let list = [...allDepartures];
    if (q) {
      list = list.filter((d) => {
        const pkg = getPackageBySlug(d.packageSlug);
        const dest = getDestinationBySlug(d.destinationSlug);
        return (
          d.code.toLowerCase().includes(q) ||
          pkg?.title?.toLowerCase().includes(q) ||
          dest?.name?.toLowerCase().includes(q) ||
          d.startDate.includes(q)
        );
      });
    }
    return list.sort((a, b) => a.startDate.localeCompare(b.startDate));
  }, [allDepartures, search]);

  const stats = useMemo(() => {
    const total = allDepartures.length;
    const open = allDepartures.filter((d) => d.status === "open").length;
    const filling = allDepartures.filter((d) => d.status === "filling").length;
    const full = allDepartures.filter((d) => d.status === "full").length;
    const closed = allDepartures.filter((d) => d.status === "closed").length;
    const totalSeats = allDepartures.reduce((sum, d) => sum + d.seatsTotal, 0);
    return { total, open, filling, full, closed, totalSeats };
  }, [allDepartures]);

  const handleDeleteClick = (id: string) => {
    setPendingId(id);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!pendingId) return;
    try {
      deleteDeparture(pendingId);
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
          <p className="text-sm text-muted-foreground mt-1">Manage trip dates, availability, and pricing.</p>
        </div>
        <Button className="rounded-xl bg-brand text-brand-foreground hover:bg-brand/90 h-10 px-4 text-sm font-semibold shadow-lg shadow-brand/10" asChild>
          <Link href="/departures/new"><Plus className="mr-1.5 h-4 w-4" /> Add Dates</Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card className="border border-border/40 bg-white rounded-2xl">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-brand/10 flex items-center justify-center">
              <Route className="h-5 w-5 text-brand" />
            </div>
            <div>
              <p className="text-xl font-bold leading-none">{stats.total}</p>
              <p className="text-xs text-muted-foreground mt-1">Total Departures</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border border-border/40 bg-white rounded-2xl">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-emerald-100 flex items-center justify-center">
              <CheckCircle2 className="h-5 w-5 text-emerald-700" />
            </div>
            <div>
              <p className="text-xl font-bold leading-none">{stats.open}</p>
              <p className="text-xs text-muted-foreground mt-1">Open</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border border-border/40 bg-white rounded-2xl">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-amber-100 flex items-center justify-center">
              <AlertCircle className="h-5 w-5 text-amber-700" />
            </div>
            <div>
              <p className="text-xl font-bold leading-none">{stats.filling}</p>
              <p className="text-xs text-muted-foreground mt-1">Filling Fast</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border border-border/40 bg-white rounded-2xl">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-red-100 flex items-center justify-center">
              <XCircle className="h-5 w-5 text-red-700" />
            </div>
            <div>
              <p className="text-xl font-bold leading-none">{stats.full}</p>
              <p className="text-xs text-muted-foreground mt-1">Fully Booked</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border border-border/40 bg-white rounded-2xl">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gray-100 flex items-center justify-center">
              <Clock className="h-5 w-5 text-gray-600" />
            </div>
            <div>
              <p className="text-xl font-bold leading-none">{stats.closed}</p>
              <p className="text-xs text-muted-foreground mt-1">Closed</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border border-border/40 bg-white rounded-2xl">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-purple-100 flex items-center justify-center">
              <Users className="h-5 w-5 text-purple-700" />
            </div>
            <div>
              <p className="text-xl font-bold leading-none">{stats.totalSeats}</p>
              <p className="text-xs text-muted-foreground mt-1">Total Seats</p>
            </div>
          </CardContent>
        </Card>
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
        getPackageBySlug={getPackageBySlug}
        getDestinationBySlug={getDestinationBySlug}
        onDeleteClick={handleDeleteClick}
      />

      <ConfirmDialog
        open={confirmOpen}
        title="Delete Departure"
        description="This will permanently remove this trip departure. This action cannot be undone."
        confirmLabel="Delete"
        onConfirm={handleConfirmDelete}
        onCancel={() => { setConfirmOpen(false); setPendingId(null); }}
      />
    </div>
  );
}
