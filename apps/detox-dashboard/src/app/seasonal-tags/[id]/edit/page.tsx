"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, Input } from "@urbandetox/ui";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { updateSeasonalTag } from "@/lib/admin-data";
import { useAdminSeasonalTags } from "@/hooks/use-admin-data";
import { PageHeader } from "@/components/ui/PageHeader";
import { FormActions } from "@/components/forms/FormActions";
import { IconPicker } from "@/components/shared/IconPicker";
import { toast } from "sonner";

const schema = z.object({
  name: z.string().min(1, "Tag name is required"),
  iconName: z.string().min(1, "Icon name is required"),
  label: z.string().min(1, "Display label is required"),
  sortOrder: z.number().min(1, "Sort order must be 1 or more"),
});

type FormData = z.infer<typeof schema>;

export default function EditSeasonalTagPage() {
  const params = useParams();
  const router = useRouter();
  const id = String(params.id);
  const { data: tags } = useAdminSeasonalTags();
  const tag = tags.find((t) => t.id === id);

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      iconName: "Sun",
      label: "",
      sortOrder: 1,
    },
  });

  useEffect(() => {
    if (tag) {
      form.reset({
        name: tag.name,
        iconName: tag.iconName,
        label: tag.label,
        sortOrder: tag.sortOrder,
      });
    }
  }, [tag, form]);

  if (!tag) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-bold mb-2">Tag not found</h2>
        <Link href="/seasonal-tags" className="text-brand hover:underline">Back to Tags</Link>
      </div>
    );
  }

  async function onSubmit(data: FormData) {
    const slug = data.name.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-");
    try {
      await updateSeasonalTag(id, { ...data, slug });
      toast.success("Tag updated successfully");
      router.push("/seasonal-tags");
    } catch {
      toast.error("Failed to update tag");
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <PageHeader backHref="/seasonal-tags" backLabel="Back to Tags" title="Edit Seasonal Tag" subtitle={`Update ${tag.name}.`} />

      <Card className="border-0 shadow-lg shadow-black/[0.03] bg-white rounded-2xl">
        <CardContent className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tag Name</FormLabel>
                    <FormControl>
                      <Input className="h-11 rounded-xl" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="label"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Display Label</FormLabel>
                    <FormControl>
                      <Input className="h-11 rounded-xl" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <FormField
                  control={form.control}
                  name="iconName"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel>Lucide Icon</FormLabel>
                      <FormControl>
                        <IconPicker
                          value={field.value}
                          onChange={field.onChange}
                          error={fieldState.error?.message}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="sortOrder"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sort Order</FormLabel>
                      <FormControl>
                        <Input type="number" min={1} className="h-11 rounded-xl" {...field} onChange={(e) => field.onChange(parseInt(e.target.value) || 1)} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormActions submitLabel="Save Changes" cancelHref="/seasonal-tags" />
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
