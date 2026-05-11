"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent } from "@urbandetox/ui";
import { Button } from "@urbandetox/ui";
import { Input } from "@urbandetox/ui";
import { Label } from "@urbandetox/ui";
import { Textarea } from "@urbandetox/ui";
import { updateDestination } from "@/lib/admin-data";
import { useAdminDestination } from "@/hooks/use-admin-data";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function EditDestinationPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const dest = useAdminDestination(slug);

  const [form, setForm] = useState({
    name: dest?.name || "",
    region: dest?.region || "",
    description: dest?.description || "",
    image: dest?.image || "",
    meetingPoint: dest?.meetingPoint || "",
    vibe: dest?.vibe || "",
  });

  if (!dest) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-bold mb-2">Destination not found</h2>
        <Link href="/destinations" className="text-brand hover:underline">Back to Destinations</Link>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateDestination(slug, form);
    router.push("/destinations");
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Link href="/destinations" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back to Destinations
      </Link>
      <h1 className="text-2xl font-bold tracking-tight mb-1">Edit Destination</h1>
      <p className="text-sm text-muted-foreground mb-6">Update {dest.name} details.</p>

      <Card className="border-0 shadow-lg shadow-black/[0.03] bg-white rounded-2xl">
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="h-11 rounded-xl" required />
              </div>
              <div className="space-y-2">
                <Label>Slug</Label>
                <Input value={slug} readOnly className="h-11 rounded-xl bg-secondary/30" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Region</Label>
              <Input value={form.region} onChange={(e) => setForm({ ...form, region: e.target.value })} className="h-11 rounded-xl" required />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="rounded-xl min-h-[100px]" required />
            </div>
            <ImageUpload value={form.image} onChange={(v) => setForm({ ...form, image: v })} label="Cover Image" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label>Meeting Point</Label>
                <Input value={form.meetingPoint} onChange={(e) => setForm({ ...form, meetingPoint: e.target.value })} className="h-11 rounded-xl" required />
              </div>
              <div className="space-y-2">
                <Label>Vibe</Label>
                <Input value={form.vibe} onChange={(e) => setForm({ ...form, vibe: e.target.value })} className="h-11 rounded-xl" required />
              </div>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <Button type="submit" className="rounded-xl bg-brand text-brand-foreground hover:bg-brand/90 h-11 px-6 text-sm font-semibold shadow-lg shadow-brand/10">Save Changes</Button>
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
