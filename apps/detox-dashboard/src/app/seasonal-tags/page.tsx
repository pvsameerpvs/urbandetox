"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@urbandetox/ui";
import { Plus, ArrowLeft, Pencil, Trash2 } from "lucide-react";
import { useAdminSeasonalTags } from "@/hooks/use-admin-data";
import { getPackagesUsingTag, deleteSeasonalTag } from "@/lib/admin-data";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { getLucideIcon } from "@/components/admin/IconPicker";
import { toast } from "sonner";
import type { SeasonalTag } from "@urbandetox/utils";

export default function SeasonalTagsPage() {
  const tags = useAdminSeasonalTags();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingTag, setPendingTag] = useState<SeasonalTag | null>(null);

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

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link href="/settings" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back to Settings
          </Link>
          <h1 className="text-2xl font-bold tracking-tight">Seasonal Tags</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage tags for categorizing detox packages by season and mood.</p>
        </div>
        <Button className="rounded-xl bg-brand text-brand-foreground hover:bg-brand/90 h-10 px-4 text-sm font-semibold shadow-lg shadow-brand/10" asChild>
          <Link href="/seasonal-tags/new"><Plus className="mr-1.5 h-4 w-4" /> New Tag</Link>
        </Button>
      </div>

      <div className="bg-white rounded-2xl border-0 shadow-lg shadow-black/[0.03] overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/40 bg-secondary/[0.03]">
              <th className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wider text-muted-foreground">Tag Name</th>
              <th className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wider text-muted-foreground">Slug</th>
              <th className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wider text-muted-foreground">Display Label</th>
              <th className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wider text-muted-foreground">Icon</th>
              <th className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wider text-muted-foreground">Packages</th>
              <th className="text-right px-4 py-3 font-semibold text-xs uppercase tracking-wider text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {[...tags].sort((a, b) => a.sortOrder - b.sortOrder).map((tag) => {
              const pkgCount = getPackagesUsingTag(tag.name);
              const TagIcon = getLucideIcon(tag.iconName);
              return (
                <tr key={tag.id} className="border-b border-border/30 hover:bg-secondary/[0.02] transition-colors">
                  <td className="px-4 py-3 font-medium">{tag.name}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground font-mono">{tag.slug}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{tag.label}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <TagIcon className="h-4 w-4 text-brand" />
                      <span className="text-xs text-muted-foreground">{tag.iconName}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs">
                    <span className={pkgCount > 0 ? "text-foreground font-medium" : "text-muted-foreground"}>
                      {pkgCount} package{pkgCount !== 1 ? "s" : ""}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/seasonal-tags/${tag.id}/edit`} className="inline-flex items-center gap-1 text-xs font-semibold text-brand hover:text-brand/80 transition-colors">
                        <Pencil className="h-3 w-3" /> Edit
                      </Link>
                      <button onClick={() => handleDeleteClick(tag)} className="inline-flex items-center gap-1 text-xs text-red-500 hover:text-red-700 transition-colors">
                        <Trash2 className="h-3 w-3" /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

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
