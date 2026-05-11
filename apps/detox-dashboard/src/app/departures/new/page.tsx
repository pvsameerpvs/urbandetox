"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, Button, Input } from "@urbandetox/ui";
import { createDeparture } from "@/lib/admin-data";
import { useAdminPackages } from "@/hooks/use-admin-data";
import { generateId } from "@/lib/id";
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
  code: z.string().min(1, "Departure code is required"),
  packageSlug: z.string().min(1, "Package is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  price: z.number().min(0, "Price must be 0 or more"),
  offerPrice: z.number().min(0, "Offer price must be 0 or more"),
  seatsTotal: z.number().min(1, "Must have at least 1 seat"),
  seatsLeft: z.number().min(0, "Seats left cannot be negative"),
  status: z.enum(["open", "filling", "full", "closed"]),
});

type FormData = z.infer<typeof schema>;

export default function NewDeparturePage() {
  const router = useRouter();
  const packages = useAdminPackages();

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      code: "",
      packageSlug: packages[0]?.slug || "",
      startDate: "",
      endDate: "",
      price: 0,
      offerPrice: 0,
      seatsTotal: 10,
      seatsLeft: 10,
      status: "open",
    },
  });

  // eslint-disable-next-line react-hooks/incompatible-library
  const selectedPkg = packages.find((p) => p.slug === form.watch("packageSlug"));

  function onSubmit(data: FormData) {
    createDeparture({
      ...data,
      id: generateId("dep"),
      destinationSlug: selectedPkg?.destinationSlug || "",
    });
    router.push("/departures");
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Link href="/departures" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back to Departures
      </Link>
      <h1 className="text-2xl font-bold tracking-tight mb-1">New Departure</h1>
      <p className="text-sm text-muted-foreground mb-6">Add trip dates for a package.</p>

      <Card className="border-0 shadow-lg shadow-black/[0.03] bg-white rounded-2xl">
        <CardContent className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="packageSlug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Package</FormLabel>
                    <FormControl>
                      <select {...field} className="h-11 w-full rounded-xl border border-border/60 bg-white px-3 text-sm">
                        {packages.map((p) => (<option key={p.slug} value={p.slug}>{p.title}</option>))}
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Departure Code</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. KAS3-JUN20" className="h-11 rounded-xl" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Date</FormLabel>
                      <FormControl>
                        <Input type="date" className="h-11 rounded-xl" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Date</FormLabel>
                      <FormControl>
                        <Input type="date" className="h-11 rounded-xl" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price (₹)</FormLabel>
                      <FormControl>
                        <Input type="number" className="h-11 rounded-xl" min={0} {...field} onChange={(e) => field.onChange(parseInt(e.target.value) || 0)} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="offerPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Offer Price (₹)</FormLabel>
                      <FormControl>
                        <Input type="number" className="h-11 rounded-xl" min={0} {...field} onChange={(e) => field.onChange(parseInt(e.target.value) || 0)} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <FormField
                  control={form.control}
                  name="seatsTotal"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Total Seats</FormLabel>
                      <FormControl>
                        <Input type="number" className="h-11 rounded-xl" min={1} {...field} onChange={(e) => field.onChange(parseInt(e.target.value) || 1)} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="seatsLeft"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Seats Left</FormLabel>
                      <FormControl>
                        <Input type="number" className="h-11 rounded-xl" min={0} {...field} onChange={(e) => field.onChange(parseInt(e.target.value) || 0)} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <FormControl>
                      <select {...field} className="h-11 w-full rounded-xl border border-border/60 bg-white px-3 text-sm">
                        <option value="open">Open</option>
                        <option value="filling">Filling</option>
                        <option value="full">Full</option>
                        <option value="closed">Closed</option>
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex items-center gap-3 pt-2">
                <Button type="submit" className="rounded-xl bg-brand text-brand-foreground hover:bg-brand/90 h-11 px-6 text-sm font-semibold shadow-lg shadow-brand/10">
                  Create Departure
                </Button>
                <Button type="button" variant="outline" className="rounded-xl h-11 px-6 text-sm" asChild>
                  <Link href="/departures">Cancel</Link>
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
