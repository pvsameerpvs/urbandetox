"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, Button, Input, Label, Textarea } from "@urbandetox/ui";
import { createDestination } from "@/lib/admin-data";
import { generateId } from "@/lib/id";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { GalleryUpload } from "@/components/admin/GalleryUpload";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NewDestinationPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    region: "",
    description: "",
    image: "",
    meetingPoint: "",
    vibe: "",
    gallery: [""],
  });

  const setField = (field: string, value: string | string[]) => setForm({ ...form, [field]: value });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const slug = form.name.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-");
    createDestination({ ...form, id: generateId("dest"), slug, gallery: form.gallery.filter(Boolean) });
    router.push("/destinations");
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Link href="/destinations" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back to Destinations
      </Link>
      <h1 className="text-2xl font-bold tracking-tight mb-1">New Destination</h1>
      <p className="text-sm text-muted-foreground mb-6">Create a new detox destination.</p>

      <Card className="border-0 shadow-lg shadow-black/[0.03] bg-white rounded-2xl">
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Kashmir" className="h-11 rounded-xl" required />
              </div>
              <div className="space-y-2">
                <Label>Slug</Label>
                <Input value={form.name.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-")} readOnly className="h-11 rounded-xl bg-secondary/30" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Region</Label>
              <Input value={form.region} onChange={(e) => setForm({ ...form, region: e.target.value })} placeholder="e.g. Jammu & Kashmir - Himalayas" className="h-11 rounded-xl" required />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Describe the destination..." className="rounded-xl min-h-[100px]" required />
            </div>
            <ImageUpload value={form.image} onChange={(v) => setField("image", v)} label="Cover Image" />
            <div className="space-y-2">
              <Label>Gallery Images</Label>
              <GalleryUpload items={form.gallery} onAdd={(v) => setForm({ ...form, gallery: [...form.gallery, v] })} onRemove={(i) => setForm({ ...form, gallery: form.gallery.filter((_, j) => j !== i) })} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label>Meeting Point</Label>
                <Input value={form.meetingPoint} onChange={(e) => setForm({ ...form, meetingPoint: e.target.value })} placeholder="e.g. Srinagar Airport" className="h-11 rounded-xl" required />
              </div>
              <div className="space-y-2">
                <Label>Vibe</Label>
                <Input value={form.vibe} onChange={(e) => setForm({ ...form, vibe: e.target.value })} placeholder="e.g. Deep, alpine, lake-led" className="h-11 rounded-xl" required />
              </div>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <Button type="submit" className="rounded-xl bg-brand text-brand-foreground hover:bg-brand/90 h-11 px-6 text-sm font-semibold shadow-lg shadow-brand/10">Create Destination</Button>
              <Button type="button" variant="outline" className="rounded-xl h-11 px-6 text-sm" asChild>
                <Link href="/destinations">Cancel</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
