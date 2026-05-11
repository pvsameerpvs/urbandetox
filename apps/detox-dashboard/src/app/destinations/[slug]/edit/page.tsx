"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, Button, Input, Textarea } from "@urbandetox/ui";
import { updateDestination } from "@/lib/admin-data";
import { useAdminDestination } from "@/hooks/use-admin-data";
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

export default function EditDestinationPage() {
  const params = useParams();
  const router = useRouter();
  const slug = String(params.slug);
  const dest = useAdminDestination(slug);

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

  useEffect(() => {
    if (dest) {
      form.reset({
        name: dest.name,
        region: dest.region,
        description: dest.description,
        image: dest.image,
        meetingPoint: dest.meetingPoint,
        vibe: dest.vibe,
        gallery: dest.gallery || [],
      });
    }
  }, [dest, form]);

  if (!dest) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-bold mb-2">Destination not found</h2>
        <Link href="/destinations" className="text-brand hover:underline">Back to Destinations</Link>
      </div>
    );
  }

  function onSubmit(data: FormData) {
    updateDestination(slug, { ...data, gallery: data.gallery.filter(Boolean) });
    router.push("/destinations");
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Link href="/destinations" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back to Destinations
      </Link>
      <h1 className="text-2xl font-bold tracking-tight mb-1">Edit Destination</h1>
      <p className="text-sm text-muted-foreground mb-6">Update {dest.name} details.</p>

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
                        <Input className="h-11 rounded-xl" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormItem>
                  <FormLabel>Slug</FormLabel>
                  <Input value={slug} readOnly className="h-11 rounded-xl bg-secondary/30" />
                </FormItem>
              </div>

              <FormField
                control={form.control}
                name="region"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Region</FormLabel>
                    <FormControl>
                      <Input className="h-11 rounded-xl" {...field} />
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
                      <Textarea className="rounded-xl min-h-[100px]" {...field} />
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
                        <Input className="h-11 rounded-xl" {...field} />
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
                        <Input className="h-11 rounded-xl" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <Button type="submit" className="rounded-xl bg-brand text-brand-foreground hover:bg-brand/90 h-11 px-6 text-sm font-semibold shadow-lg shadow-brand/10">
                  Save Changes
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
