"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@urbandetox/ui";
import { Input } from "@urbandetox/ui";
import { Textarea } from "@urbandetox/ui";
import { Label } from "@urbandetox/ui";
import { Checkbox } from "@urbandetox/ui";
import { FormSection } from "@/components/forms/FormSection";
import { ImageUpload } from "@/components/shared/ImageUpload";
import { getDestinations, getPackages } from "@/lib/admin-data";
import type { GuideArticle, Destination, Package } from "@urbandetox/utils";

const existingCategories = ["Destination Guides", "Travel Tips", "Packing Guides", "Group Travel", "Seasonal Detox"];

interface GuideFormProps {
  initial?: GuideArticle;
  onSave: (guide: GuideArticle | Omit<GuideArticle, "id">) => void | Promise<void>;
}

export function GuideForm({ initial, onSave }: GuideFormProps) {
  const router = useRouter();

  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [allPackages, setAllPackages] = useState<Package[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(async () => {
      const [dests, pkgs] = await Promise.all([getDestinations(), getPackages()]);
      setDestinations(dests);
      setAllPackages(pkgs);
      setReady(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const [title, setTitle] = useState(initial?.title ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [category, setCategory] = useState(initial?.category ?? "");
  const [destinationSlug, setDestinationSlug] = useState(initial?.destinationSlug ?? "");
  const [excerpt, setExcerpt] = useState(initial?.excerpt ?? "");
  const [content, setContent] = useState(initial?.content ?? "");
  const [image, setImage] = useState(initial?.image ?? "");
  const [featured, setFeatured] = useState(initial?.featured ?? false);
  const [relatedSlugs, setRelatedSlugs] = useState(initial?.relatedPackageSlugs?.join(", ") ?? "");
  const [error, setError] = useState("");

  const relatedPackages = destinationSlug
    ? allPackages.filter((p) => p.destinationSlug === destinationSlug)
    : allPackages;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !slug.trim() || !category.trim() || !excerpt.trim() || !content.trim() || !image.trim()) {
      setError("Please fill in all required fields.");
      return;
    }
    const cleanSlug = slug.trim().toLowerCase().replace(/\s+/g, "-");
    const guide = {
      ...(initial?.id ? { id: initial.id } : {}),
      slug: cleanSlug,
      title: title.trim(),
      category: category.trim(),
      destinationSlug: destinationSlug || undefined,
      excerpt: excerpt.trim(),
      content: content.trim(),
      image: image.trim(),
      featured,
      relatedPackageSlugs: relatedSlugs.split(",").map((s) => s.trim()).filter(Boolean),
    };
    await onSave(guide);
    router.push("/guides");
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      {error && (
        <div className="rounded-xl bg-red-50 border border-red-200 p-4 text-sm text-red-700">{error}</div>
      )}

      <FormSection title="Basic Info">
        <div className="space-y-4">
          <div>
            <Label>Title</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Best Time to Visit Kodaikanal" className="mt-1.5" required />
          </div>
          <div>
            <Label>Slug</Label>
            <Input value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="e.g. best-time-to-visit-kodai" className="mt-1.5" required />
            <p className="text-xs text-muted-foreground mt-1">URL-friendly identifier. Auto-formatted on save.</p>
          </div>
          <div>
            <Label>Category</Label>
            <Input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="e.g. Destination Guides" className="mt-1.5" list="guide-cats" required />
            <datalist id="guide-cats">
              {existingCategories.map((c) => <option key={c} value={c} />)}
            </datalist>
          </div>
          <div>
            <Label>Destination</Label>
            <select
              value={destinationSlug}
              onChange={(e) => {
                setDestinationSlug(e.target.value);
                setRelatedSlugs("");
              }}
              disabled={!ready}
              className="mt-1.5 w-full h-10 rounded-xl border border-input bg-white px-3 text-sm disabled:opacity-50"
            >
              <option value="">{ready ? "None" : "Loading..."}</option>
              {destinations.map((d) => <option key={d.slug} value={d.slug}>{d.name}</option>)}
            </select>
            <p className="text-xs text-muted-foreground mt-1">Choosing a destination filters the related packages below.</p>
          </div>
        </div>
      </FormSection>

      <FormSection title="Content">
        <div className="space-y-4">
          <div>
            <Label>Excerpt</Label>
            <Textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} placeholder="Short summary shown on cards..." className="mt-1.5 min-h-[80px]" required />
          </div>
          <div>
            <Label>Full Content</Label>
            <Textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Use **Heading** for sections and - bullet for lists..." className="mt-1.5 min-h-[200px]" required />
            <p className="text-xs text-muted-foreground mt-1">Supports **bold headings** and - bullet lists.</p>
          </div>
        </div>
      </FormSection>

      <FormSection title="Media & Links">
        <div className="space-y-4">
          <div>
            <Label>Cover Image</Label>
            <div className="mt-1.5">
              <ImageUpload value={image} onChange={setImage} folder="guides/covers" />
            </div>
          </div>
          <div>
            <Label>Related Packages</Label>
            <Input value={relatedSlugs} onChange={(e) => setRelatedSlugs(e.target.value)} placeholder="kodaikanal-5days, kodaikanal-6days" className="mt-1.5" disabled={!ready} />
            <p className="text-xs text-muted-foreground mt-1">
              {ready
                ? (destinationSlug
                    ? `Showing packages for ${destinations.find((d) => d.slug === destinationSlug)?.name ?? "this destination"}.`
                    : "Choose a destination above to filter packages, or type slugs manually.")
                : "Loading packages..."}
            </p>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {ready && relatedPackages.map((p) => (
                <button
                  key={p.slug}
                  type="button"
                  onClick={() => setRelatedSlugs((prev) => prev ? `${prev}, ${p.slug}` : p.slug)}
                  className="text-[10px] bg-secondary px-2 py-1 rounded-md hover:bg-brand/10 transition-colors"
                  title={p.title}
                >
                  {p.slug}
                </button>
              ))}
            </div>
            {ready && destinationSlug && relatedPackages.length === 0 && (
              <p className="text-xs text-amber-600 mt-2">No packages found for this destination.</p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Checkbox id="featured" checked={featured} onCheckedChange={(v) => setFeatured(v === true)} />
            <Label htmlFor="featured" className="font-normal cursor-pointer">Featured on homepage</Label>
          </div>
        </div>
      </FormSection>

      <div className="flex items-center gap-3 pt-2">
        <Button type="submit" className="rounded-xl bg-brand text-brand-foreground hover:bg-brand/90 h-11 px-6 font-semibold">
          {initial ? "Save Changes" : "Create Guide"}
        </Button>
        <Button type="button" variant="outline" className="rounded-xl h-11 px-6" onClick={() => router.push("/guides")}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
