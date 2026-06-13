"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { Card, CardContent } from "@urbandetox/ui";
import {
  Users,
  CheckCircle2,
  Clock,
  CalendarDays,
  CreditCard,
  Banknote,
} from "lucide-react";
import { getAllBookings, type BookingWithMeta } from "@/lib/bookings";
import { useAdminDepartures, useAdminPackages, useAdminDestinations } from "@/hooks/use-admin-data";
import { useBookingNotifications } from "@/components/layout/BookingNotificationContext";
import { BookingTable } from "./components/BookingTable";

export default function BookingsPage() {
  const [bookings, setBookings] = useState<BookingWithMeta[]>([]);
  const { clearUnread } = useBookingNotifications();
  const { data: departures } = useAdminDepartures();
  const { data: packages } = useAdminPackages();
  const { data: destinations } = useAdminDestinations();

  const loadBookings = useCallback(async () => {
    try {
      const raw = await getAllBookings();
      const enriched = raw.map((b) => {
        const dep = departures.find((d) => d.code === b.departureCode);
        const pkg = dep ? packages.find((p) => p.slug === dep.packageSlug) : undefined;
        const dest = dep ? destinations.find((d) => d.slug === dep.destinationSlug) : undefined;
        return {
          ...b,
          packageSlug: dep?.packageSlug,
          packageTitle: pkg?.title,
          destinationName: dest?.name,
          startDate: dep?.startDate,
          endDate: dep?.endDate,
          price: dep?.offerPrice || dep?.price,
        };
      });
      setBookings(enriched);
    } catch {
      // Keep the last successful dashboard snapshot during temporary API errors.
    }
  }, [departures, packages, destinations]);

  useEffect(() => {
    clearUnread();
    const initialLoad = window.setTimeout(() => void loadBookings(), 0);
    const interval = window.setInterval(() => void loadBookings(), 15000);
    return () => {
      window.clearTimeout(initialLoad);
      window.clearInterval(interval);
    };
  }, [clearUnread, loadBookings]);

  const stats = useMemo(() => {
    const total = bookings.length;
    const complete = bookings.filter((b) => b.onboardingComplete).length;
    const pending = total - complete;
    const paid = bookings.filter((b) => b.paymentStatus === "paid").length;
    const cod = bookings.filter((b) => b.paymentStatus === "cod").length;
    const totalTravelers = bookings.reduce((sum, b) => sum + b.travelerCount, 0);
    return { total, complete, pending, paid, cod, totalTravelers };
  }, [bookings]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Bookings</h1>
        <p className="text-sm text-muted-foreground mt-1">View and manage customer bookings and onboarding details.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card className="border border-border/40 bg-white rounded-2xl">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-brand/10 flex items-center justify-center">
              <Users className="h-5 w-5 text-brand" />
            </div>
            <div>
              <p className="text-xl font-bold leading-none">{stats.total}</p>
              <p className="text-xs text-muted-foreground mt-1">Total Bookings</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border border-border/40 bg-white rounded-2xl">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-emerald-100 flex items-center justify-center">
              <CheckCircle2 className="h-5 w-5 text-emerald-700" />
            </div>
            <div>
              <p className="text-xl font-bold leading-none">{stats.complete}</p>
              <p className="text-xs text-muted-foreground mt-1">Onboarding Complete</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border border-border/40 bg-white rounded-2xl">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-amber-100 flex items-center justify-center">
              <Clock className="h-5 w-5 text-amber-700" />
            </div>
            <div>
              <p className="text-xl font-bold leading-none">{stats.pending}</p>
              <p className="text-xs text-muted-foreground mt-1">Pending</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border border-border/40 bg-white rounded-2xl">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-emerald-100 flex items-center justify-center">
              <CreditCard className="h-5 w-5 text-emerald-700" />
            </div>
            <div>
              <p className="text-xl font-bold leading-none">{stats.paid}</p>
              <p className="text-xs text-muted-foreground mt-1">Paid Online</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border border-border/40 bg-white rounded-2xl">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-blue-100 flex items-center justify-center">
              <Banknote className="h-5 w-5 text-blue-700" />
            </div>
            <div>
              <p className="text-xl font-bold leading-none">{stats.cod}</p>
              <p className="text-xs text-muted-foreground mt-1">Pay on Arrival</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border border-border/40 bg-white rounded-2xl">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-purple-100 flex items-center justify-center">
              <CalendarDays className="h-5 w-5 text-purple-700" />
            </div>
            <div>
              <p className="text-xl font-bold leading-none">{stats.totalTravelers}</p>
              <p className="text-xs text-muted-foreground mt-1">Total Travelers</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <BookingTable bookings={bookings} />
    </div>
  );
}
