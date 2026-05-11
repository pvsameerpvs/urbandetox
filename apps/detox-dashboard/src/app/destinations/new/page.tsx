"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, Button, Input, Textarea } from "@urbandetox/ui";
import { createDestination } from "@/lib/admin-data";
import { generateId } from "@/lib/id";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { GalleryUpload } from "@/components/admin/GalleryUpload";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

const schema = z.object({
  name: z.string().min(1, "Destination name is required"),
  region: z.string().min(1, "Region is required"),
  description: z.string().min(1, "Description is required"),
  image: z.string().min(1, "Cover image is required"),
  meetingPoint: z.string().min(1, "Meeting point is required"),
  vibe: z.string().min(1, "Vibe is required"),
  gallery: z.array(z.string()),
});

type FormData = z.infer<typeof schema>;

export default function NewDestinationPage() {
  const router = useRouter();
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      region: "",
      description: "",
      image: "",
      meetingPoint: "",
      vibe: "",
      gallery: [],
    },
  });

  // eslint-disable-next-line react-hooks/incompatible-library
  const nameValue = form.watch("name");
  const computedSlug = nameValue
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

  function onSubmit(data: FormData) {
    createDestination({
      ...data,
      id: generateId("dest"),
      slug: computedSlug || "untitled",
      gallery: data.gallery.filter(Boolean),
    });
    router.push("/destinations");
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Link href="/destinations" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back to Destinations
      </Link>
      <h1 className="text-2xl font-bold tracking-tight mb-1">New Destination</h1>
      <p className="text-sm text-muted-foreground mb-6">Create a new detox destination.</p>

      <Card className="border-0 shadow-lg shadow-black/[0.03] bg-white rounded-2xl">
        <CardContent className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Kashmir" className="h-11 rounded-xl" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormItem>
                  <FormLabel>Slug</FormLabel>
                  <Input value={computedSlug} readOnly className="h-11 rounded-xl bg-secondary/30" />
                </FormItem>
              </div>

              <FormField
                control={form.control}
                name="region"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Region</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Jammu & Kashmir - Himalayas" className="h-11 rounded-xl" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Describe the destination..." className="rounded-xl min-h-[100px]" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cover Image</FormLabel>
                    <FormControl>
                      <ImageUpload value={field.value} onChange={field.onChange} label="Cover Image" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="gallery"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gallery Images</FormLabel>
                    <FormControl>
                      <GalleryUpload
                        items={field.value}
                        onAdd={(v) => field.onChange([...field.value, v])}
                        onRemove={(i) => field.onChange(field.value.filter((_, j) => j !== i))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <FormField
                  control={form.control}
                  name="meetingPoint"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Meeting Point</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Srinagar Airport" className="h-11 rounded-xl" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="vibe"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Vibe</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Deep, alpine, lake-led" className="h-11 rounded-xl" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <Button type="submit" className="rounded-xl bg-brand text-brand-foreground hover:bg-brand/90 h-11 px-6 text-sm font-semibold shadow-lg shadow-brand/10">
                  Create Destination
                </Button>
                <Button type="button" variant="outline" className="rounded-xl h-11 px-6 text-sm" asChild>
                  <Link href="/destinations">Cancel</Link>
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
