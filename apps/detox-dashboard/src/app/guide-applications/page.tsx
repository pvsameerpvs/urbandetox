"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2, UserPlus } from "lucide-react";
import { toast } from "sonner";
import {
  fetchGuideApplications,
  updateGuideApplication,
  deleteGuideApplication,
  type GuideApplication,
} from "@/lib/api";
import { ApplicationCard } from "./components/ApplicationCard";

const FILTERS = ["all", "new", "reviewing", "shortlisted", "hired", "rejected"] as const;

export default function GuideApplicationsPage() {
  const [applications, setApplications] = useState<GuideApplication[]>([]);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [filter, setFilter] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async (status: string) => {
    setLoading(true);
    try {
      const data = await fetchGuideApplications(status);
      setApplications(data.applications);
      setCounts(data.counts);
    } catch {
      toast.error("Could not load applications");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void load(filter); }, [filter, load]);

  const setStatus = async (id: string, status: string) => {
    setBusyId(id);
    try {
      await updateGuideApplication(id, { status });
      toast.success(`Marked as ${status}`);
      await load(filter);
    } catch {
      toast.error("Could not update");
    } finally {
      setBusyId(null);
    }
  };

  const remove = async (id: string, name: string) => {
    if (!window.confirm(`Delete the application from ${name}? This cannot be undone.`)) return;
    setBusyId(id);
    try {
      await deleteGuideApplication(id);
      toast.success("Application deleted");
      await load(filter);
    } catch {
      toast.error("Could not delete");
    } finally {
      setBusyId(null);
    }
  };

  const total = Object.values(counts).reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Guide Applications</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          People applying to guide trips. Separate from Guides, which are travel articles.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors ${
              filter === f
                ? "border-brand bg-brand text-brand-foreground"
                : "border-border bg-white text-muted-foreground hover:border-brand/40"
            }`}
          >
            {f} {f === "all" ? total : (counts[f] ?? 0)}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-brand" />
        </div>
      ) : applications.length === 0 ? (
        <div className="rounded-2xl border border-border/40 bg-white p-12 text-center">
          <div className="mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-secondary">
            <UserPlus className="h-5 w-5 text-muted-foreground" />
          </div>
          <p className="font-bold">No applications{filter !== "all" ? ` marked ${filter}` : " yet"}</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Applications arrive from the Become a Guide page at /join-us.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((a) => (
            <ApplicationCard
              key={a.id}
              application={a}
              busy={busyId === a.id}
              onStatus={(s) => setStatus(a.id, s)}
              onDelete={() => remove(a.id, a.fullName)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
