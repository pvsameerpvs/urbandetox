"use client";

import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input, Textarea } from "@urbandetox/ui";
import { ImageUpload } from "@/components/shared/ImageUpload";
import { GalleryUpload } from "@/components/shared/GalleryUpload";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { FormSection } from "@/components/forms/FormSection";
import { FormActions } from "@/components/forms/FormActions";
import type { Destination } from "@urbandetox/utils";

const schema = z.object({
  name: z.string().min(1, "Destination name is required"),
  region: z.string().min(1, "Region is required"),
  description: z.string().min(1, "Description is required"),
  image: z.string().min(1, "Cover image is required"),
  meetingPoint: z.string().min(1, "Meeting point is required"),
  vibe: z.string().min(1, "Vibe is required"),
  gallery: z.array(z.string()),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
});

export type DestinationFormData = z.infer<typeof schema>;

interface DestinationFormProps {
  mode: "create" | "edit";
  initialData?: Partial<Destination>;
  slugValue: string;
  onSubmit: (data: DestinationFormData) => void;
  submitLabel: string;
  cancelHref: string;
}

function generateSlug(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function DestinationForm({ mode, initialData, slugValue, onSubmit, submitLabel, cancelHref }: DestinationFormProps) {
  const form = useForm<DestinationFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: initialData?.name || "",
      region: initialData?.region || "",
      description: initialData?.description || "",
      image: initialData?.image || "",
      meetingPoint: initialData?.meetingPoint || "",
      vibe: initialData?.vibe || "",
      gallery: initialData?.gallery || [],
      seoTitle: initialData?.seoTitle || "",
      seoDescription: initialData?.seoDescription || "",
    },
  });

  const watchedName = form.watch("name");
  const displaySlug = mode === "create" ? generateSlug(watchedName) : slugValue;

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <FormSection>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder={mode === "create" ? "e.g. Kashmir" : undefined} className="h-11 rounded-xl" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormItem>
              <FormLabel>Slug</FormLabel>
              <Input value={displaySlug} readOnly className="h-11 rounded-xl bg-secondary/30" />
            </FormItem>
          </div>

          <FormField
            control={form.control}
            name="region"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Region</FormLabel>
                <FormControl>
                  <Input placeholder={mode === "create" ? "e.g. Jammu & Kashmir - Himalayas" : undefined} className="h-11 rounded-xl" {...field} />
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
                  <Textarea placeholder={mode === "create" ? "Describe the destination..." : undefined} className="rounded-xl min-h-[100px]" {...field} />
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
                  <ImageUpload value={field.value} onChange={field.onChange} label="Cover Image" folder="destinations/covers" />
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
                    folder="destinations/gallery"
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
                    <Input placeholder={mode === "create" ? "e.g. Srinagar Airport" : undefined} className="h-11 rounded-xl" {...field} />
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
                    <Input placeholder={mode === "create" ? "e.g. Deep, alpine, lake-led" : undefined} className="h-11 rounded-xl" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <FormField
              control={form.control}
              name="seoTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>SEO Title</FormLabel>
                  <FormControl>
                    <Input placeholder={mode === "create" ? "e.g. Kashmir Detox Retreat | Urban Detox" : undefined} className="h-11 rounded-xl" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="seoDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>SEO Description</FormLabel>
                  <FormControl>
                    <Input placeholder={mode === "create" ? "e.g. A 5-day reset in the Kashmir valley..." : undefined} className="h-11 rounded-xl" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormActions submitLabel={submitLabel} cancelHref={cancelHref} />
        </FormSection>
      </form>
    </FormProvider>
  );
}
