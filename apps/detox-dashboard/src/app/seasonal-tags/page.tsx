"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@urbandetox/ui";
import { Plus, ArrowLeft, Tag } from "lucide-react";
import { useAdminSeasonalTags } from "@/hooks/use-admin-data";
import { getPackagesUsingTag, deleteSeasonalTag } from "@/lib/admin-data";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { SeasonalTagCard } from "./components/SeasonalTagCard";
import { toast } from "sonner";
import type { SeasonalTag } from "@urbandetox/utils";

export default function SeasonalTagsPage() {
  const tags = useAdminSeasonalTags();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingTag, setPendingTag] = useState<SeasonalTag | null>(null);

  const totalPackages = tags.reduce((sum, t) => sum + getPackagesUsingTag(t.name), 0);

  const handleDeleteClick = (tag: SeasonalTag) => {
    setPendingTag(tag);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!pendingTag) return;
    const count = getPackagesUsingTag(pendingTag.name);
    if (count > 0) {
      toast.error(`Cannot delete: ${count} package${count > 1 ? "s" : ""} use this tag. Reassign them first.`);
      setConfirmOpen(false);
      setPendingTag(null);
      return;
    }
    try {
      deleteSeasonalTag(pendingTag.id);
      toast.success("Tag deleted successfully");
      setTimeout(() => window.location.reload(), 400);
    } catch {
      toast.error("Failed to delete tag");
    }
    setConfirmOpen(false);
    setPendingTag(null);
  };

  const sortedTags = [...tags].sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link href="/settings" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-3 transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back to Settings
          </Link>
          <h1 className="text-2xl font-bold tracking-tight">Seasonal Tags</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage tags for categorizing detox packages by season and mood.</p>
        </div>
        <Button className="rounded-xl bg-brand text-brand-foreground hover:bg-brand/90 h-10 px-4 text-sm font-semibold shadow-lg shadow-brand/10 shrink-0" asChild>
          <Link href="/seasonal-tags/new"><Plus className="mr-1.5 h-4 w-4" /> New Tag</Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-border/40 p-4 flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-brand/10 flex items-center justify-center">
            <Tag className="h-5 w-5 text-brand" />
          </div>
          <div>
            <p className="text-xl font-bold leading-none">{tags.length}</p>
            <p className="text-xs text-muted-foreground mt-1">Total Tags</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-border/40 p-4 flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-brand/10 flex items-center justify-center">
            <Tag className="h-5 w-5 text-brand" />
          </div>
          <div>
            <p className="text-xl font-bold leading-none">{totalPackages}</p>
            <p className="text-xs text-muted-foreground mt-1">Packages Tagged</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-border/40 p-4 flex items-center gap-3 col-span-2 sm:col-span-1">
          <div className="h-10 w-10 rounded-xl bg-brand/10 flex items-center justify-center">
            <Tag className="h-5 w-5 text-brand" />
          </div>
          <div>
            <p className="text-xl font-bold leading-none">{tags.filter((t) => getPackagesUsingTag(t.name) === 0).length}</p>
            <p className="text-xs text-muted-foreground mt-1">Unused Tags</p>
          </div>
        </div>
      </div>

      {/* Cards Grid */}
      {sortedTags.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedTags.map((tag) => (
            <SeasonalTagCard
              key={tag.id}
              tag={tag}
              pkgCount={getPackagesUsingTag(tag.name)}
              onDelete={handleDeleteClick}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-2xl border border-border/40">
          <div className="h-12 w-12 rounded-xl bg-secondary/50 flex items-center justify-center mx-auto mb-4">
            <Tag className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="text-base font-bold">No tags yet</h3>
          <p className="text-sm text-muted-foreground mt-1 mb-5">Create your first seasonal tag to categorize packages.</p>
          <Button className="rounded-xl bg-brand text-brand-foreground hover:bg-brand/90 h-10 px-4 text-sm font-semibold" asChild>
            <Link href="/seasonal-tags/new"><Plus className="mr-1.5 h-4 w-4" /> New Tag</Link>
          </Button>
        </div>
      )}

      <ConfirmDialog
        open={confirmOpen}
        title="Delete Seasonal Tag"
        description={`This will permanently remove "${pendingTag?.name}". Packages using this tag will need to be reassigned.`}
        confirmLabel="Delete"
        onConfirm={handleConfirmDelete}
        onCancel={() => { setConfirmOpen(false); setPendingTag(null); }}
      />
    </div>
  );
}
