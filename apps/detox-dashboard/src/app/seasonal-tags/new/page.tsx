"use client";

import { useRouter } from "next/navigation";
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
import { createSeasonalTag } from "@/lib/admin-data";
import { generateId } from "@/lib/id";
import { PageHeader } from "@/components/admin/PageHeader";
import { FormActions } from "@/components/admin/FormActions";
import { IconPicker } from "@/components/admin/IconPicker";
import { toast } from "sonner";

const schema = z.object({
  name: z.string().min(1, "Tag name is required"),
  iconName: z.string().min(1, "Icon name is required"),
  label: z.string().min(1, "Display label is required"),
  sortOrder: z.number().min(1, "Sort order must be 1 or more"),
});

type FormData = z.infer<typeof schema>;

export default function NewSeasonalTagPage() {
  const router = useRouter();

  const form = useForm<FormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(schema as any),
    defaultValues: {
      name: "",
      iconName: "Sun",
      label: "",
      sortOrder: 1,
    },
  });

  function onSubmit(data: FormData) {
    const slug = data.name.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-");
    try {
      createSeasonalTag({
        id: generateId("st"),
        name: data.name,
        slug,
        iconName: data.iconName,
        label: data.label,
        sortOrder: data.sortOrder,
      });
      toast.success("Tag created successfully");
      router.push("/seasonal-tags");
    } catch {
      toast.error("Failed to create tag");
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <PageHeader backHref="/seasonal-tags" backLabel="Back to Tags" title="New Seasonal Tag" subtitle="Create a new tag for categorizing packages." />

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
                      <Input placeholder="e.g. Winter Retreat" className="h-11 rounded-xl" {...field} />
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
                      <Input placeholder="e.g. Winter Escapes" className="h-11 rounded-xl" {...field} />
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

              <FormActions submitLabel="Create Tag" cancelHref="/seasonal-tags" />
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
