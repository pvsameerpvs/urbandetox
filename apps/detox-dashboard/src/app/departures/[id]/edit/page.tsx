"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent } from "@urbandetox/ui";
import { Button } from "@urbandetox/ui";
import { Input } from "@urbandetox/ui";
import { Label } from "@urbandetox/ui";
import { updateDeparture } from "@/lib/admin-data";
import { useAdminDepartures } from "@/hooks/use-admin-data";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function EditDeparturePage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const allDeps = useAdminDepartures();
  const dep = allDeps.find((d: { id: string }) => d.id === id);

  const [form, setForm] = useState({
    code: dep?.code || "",
    startDate: dep?.startDate || "",
    endDate: dep?.endDate || "",
    price: dep?.price || 0,
    offerPrice: dep?.offerPrice || 0,
    seatsTotal: dep?.seatsTotal || 10,
    seatsLeft: dep?.seatsLeft || 10,
    status: (dep?.status || "open") as "open" | "filling" | "full" | "closed",
  });

  if (!dep) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-bold mb-2">Departure not found</h2>
        <Link href="/departures" className="text-brand hover:underline">Back to Departures</Link>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateDeparture(id, form);
    router.push("/departures");
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Link href="/departures" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back to Departures
      </Link>
      <h1 className="text-2xl font-bold tracking-tight mb-1">Edit Departure</h1>
      <p className="text-sm text-muted-foreground mb-6">Update {dep.code} details.</p>

      <Card className="border-0 shadow-lg shadow-black/[0.03] bg-white rounded-2xl">
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label>Departure Code</Label>
              <Input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} className="h-11 rounded-xl" required />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} className="h-11 rounded-xl" required />
              </div>
              <div className="space-y-2">
                <Label>End Date</Label>
                <Input type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} className="h-11 rounded-xl" required />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label>Price (₹)</Label>
                <Input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: parseInt(e.target.value) || 0 })} className="h-11 rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label>Offer Price (₹)</Label>
                <Input type="number" value={form.offerPrice} onChange={(e) => setForm({ ...form, offerPrice: parseInt(e.target.value) || 0 })} className="h-11 rounded-xl" />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label>Total Seats</Label>
                <Input type="number" value={form.seatsTotal} onChange={(e) => setForm({ ...form, seatsTotal: parseInt(e.target.value) || 1 })} className="h-11 rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label>Seats Left</Label>
                <Input type="number" value={form.seatsLeft} onChange={(e) => setForm({ ...form, seatsLeft: parseInt(e.target.value) || 0 })} className="h-11 rounded-xl" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as typeof form.status })} className="h-11 w-full rounded-xl border border-border/60 bg-white px-3 text-sm">
                <option value="open">Open</option>
                <option value="filling">Filling</option>
                <option value="full">Full</option>
                <option value="closed">Closed</option>
              </select>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <Button type="submit" className="rounded-xl bg-brand text-brand-foreground hover:bg-brand/90 h-11 px-6 text-sm font-semibold shadow-lg shadow-brand/10">Save Changes</Button>
              <Button type="button" variant="outline" className="rounded-xl h-11 px-6 text-sm" asChild>
                <Link href="/departures">Cancel</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
