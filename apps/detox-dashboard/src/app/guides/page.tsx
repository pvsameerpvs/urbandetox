"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@urbandetox/ui";
import { Card, CardContent, Badge } from "@urbandetox/ui";
import { getAdminGuides, deleteGuide } from "@/lib/guides";
import { getDestinationBySlug } from "@/lib/admin-data";
import { BookOpen, ExternalLink, Star, Eye, Pencil, Trash2, Plus } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@urbandetox/ui";

export default function GuidesPage() {
  const guides = getAdminGuides();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingId, setPendingId] = useState<string | null>(null);

  function handleDeleteClick(id: string) {
    setPendingId(id);
    setConfirmOpen(true);
  }

  function handleConfirmDelete() {
    if (!pendingId) return;
    try {
      deleteGuide(pendingId);
      toast.success("Guide deleted successfully");
      setTimeout(() => window.location.reload(), 400);
    } catch {
      toast.error("Failed to delete guide");
    }
    setConfirmOpen(false);
    setPendingId(null);
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Guides</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Travel guides, packing lists, and destination insights shown on the frontend.
          </p>
        </div>
        <Button className="rounded-xl bg-brand text-brand-foreground hover:bg-brand/90 h-10 text-sm font-semibold" asChild>
          <Link href="/guides/new"><Plus className="mr-1.5 h-4 w-4" /> New Guide</Link>
        </Button>
      </div>

      <div className="grid gap-4">
        {guides.map((guide) => {
          const dest = guide.destinationSlug ? getDestinationBySlug(guide.destinationSlug) : undefined;

          return (
            <Card
              key={guide.id}
              className="border border-border/40 rounded-2xl bg-white overflow-hidden hover:border-brand/30 transition-colors"
            >
              <CardContent className="p-0">
                <div className="flex flex-col sm:flex-row">
                  <div className="relative h-40 sm:h-auto sm:w-48 shrink-0">
                    <Image
                      src={guide.image}
                      alt={guide.title}
                      fill
                      className="object-cover"
                      sizes="200px"
                      unoptimized
                    />
                  </div>
                  <div className="flex-1 p-4 sm:p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-2">
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-brand bg-brand/10 px-2 py-0.5 rounded-full">
                            <BookOpen className="h-3 w-3" />
                            {guide.category}
                          </span>
                          {guide.featured && (
                            <Badge className="bg-brand text-brand-foreground text-[10px] h-5 border-0">
                              <Star className="h-3 w-3 mr-1" /> Featured
                            </Badge>
                          )}
                          {dest && (
                            <span className="text-xs text-muted-foreground">{dest.name}</span>
                          )}
                        </div>
                        <h3 className="text-sm font-bold mb-1">{guide.title}</h3>
                        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                          {guide.excerpt}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Link
                          href={`/guide/${guide.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[10px] font-semibold text-brand hover:text-brand/80 transition-colors"
                        >
                          <Eye className="h-3 w-3" /> View
                        </Link>
                        <span className="text-muted-foreground">|</span>
                        <Link
                          href={`https://urbandetox.in/guide/${guide.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[10px] font-semibold text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <ExternalLink className="h-3 w-3" /> Live
                        </Link>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                        <span>Slug: <code className="font-mono text-foreground">{guide.slug}</code></span>
                        {guide.relatedPackageSlugs && guide.relatedPackageSlugs.length > 0 && (
                          <span>Linked: {guide.relatedPackageSlugs.length} package{guide.relatedPackageSlugs.length > 1 ? "s" : ""}</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/guides/${guide.id}/edit`}
                          className="inline-flex items-center gap-1 text-[10px] font-semibold text-brand hover:text-brand/80 transition-colors"
                        >
                          <Pencil className="h-3 w-3" /> Edit
                        </Link>
                        <button
                          onClick={() => handleDeleteClick(guide.id)}
                          className="inline-flex items-center gap-1 text-[10px] font-semibold text-red-500 hover:text-red-700 transition-colors"
                        >
                          <Trash2 className="h-3 w-3" /> Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {guides.length === 0 && (
        <div className="rounded-2xl bg-secondary/[0.03] border border-border/40 py-16 text-center">
          <BookOpen className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-bold mb-2">No guides yet</h3>
          <p className="text-sm text-muted-foreground mb-6">Create your first travel guide or destination tip.</p>
          <Button className="rounded-xl bg-brand text-brand-foreground hover:bg-brand/90 h-11 px-6 font-semibold" asChild>
            <Link href="/guides/new"><Plus className="mr-2 h-4 w-4" /> New Guide</Link>
          </Button>
        </div>
      )}

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="rounded-2xl">
          <DialogHeader>
            <DialogTitle>Delete Guide</DialogTitle>
            <DialogDescription>
              This will permanently remove the guide from localStorage. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" className="rounded-xl" onClick={() => setConfirmOpen(false)}>
              Cancel
            </Button>
            <Button className="rounded-xl bg-red-600 text-white hover:bg-red-700" onClick={handleConfirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
