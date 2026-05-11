"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, Button, Input } from "@urbandetox/ui";
import { updateDeparture } from "@/lib/admin-data";
import { useAdminDepartures } from "@/hooks/use-admin-data";
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
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  price: z.number().min(0, "Price must be 0 or more"),
  offerPrice: z.number().min(0, "Offer price must be 0 or more"),
  seatsTotal: z.number().min(1, "Must have at least 1 seat"),
  seatsLeft: z.number().min(0, "Seats left cannot be negative"),
  status: z.enum(["open", "filling", "full", "closed"]),
});

type FormData = z.infer<typeof schema>;

export default function EditDeparturePage() {
  const params = useParams();
  const router = useRouter();
  const id = String(params.id);
  const allDeps = useAdminDepartures();
  const dep = allDeps.find((d) => d.id === id);

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      code: "",
      startDate: "",
      endDate: "",
      price: 0,
      offerPrice: 0,
      seatsTotal: 10,
      seatsLeft: 10,
      status: "open",
    },
  });

  useEffect(() => {
    if (dep) {
      form.reset({
        code: dep.code,
        startDate: dep.startDate,
        endDate: dep.endDate,
        price: dep.price,
        offerPrice: dep.offerPrice ?? 0,
        seatsTotal: dep.seatsTotal,
        seatsLeft: dep.seatsLeft,
        status: dep.status,
      });
    }
  }, [dep, form]);

  if (!dep) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-bold mb-2">Departure not found</h2>
        <Link href="/departures" className="text-brand hover:underline">Back to Departures</Link>
      </div>
    );
  }

  function onSubmit(data: FormData) {
    updateDeparture(id, data);
    router.push("/departures");
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Link href="/departures" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back to Departures
      </Link>
      <h1 className="text-2xl font-bold tracking-tight mb-1">Edit Departure</h1>
      <p className="text-sm text-muted-foreground mb-6">Update {dep.code} details.</p>

      <Card className="border-0 shadow-lg shadow-black/[0.03] bg-white rounded-2xl">
        <CardContent className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Departure Code</FormLabel>
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
                  Save Changes
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
