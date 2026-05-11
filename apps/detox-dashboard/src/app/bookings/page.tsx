"use client";

import { useState, useEffect, useMemo } from "react";
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
import { getDepartureByCode, getPackageBySlug, getDestinationBySlug } from "@/lib/admin-data";
import { useBookingNotifications } from "@/components/admin/BookingNotificationContext";
import { BookingTable } from "./components/BookingTable";

function seedDemoBookings() {
  if (typeof window === "undefined") return;
  const key = "urbandetox-booking-KAS3-JUN20";
  if (localStorage.getItem(key)) return;

  const demo = {
    departureCode: "KAS3-JUN20",
    travelers: [
      {
        id: "t-1",
        type: "primary" as const,
        name: "Rahul Sharma",
        phone: "+91 98765 43210",
        email: "rahul@email.com",
        dateOfBirth: "1990-05-15",
        gender: "Male",
        foodPreference: "vegetarian",
        allergies: "None",
        medicalConditions: "None",
        bloodGroup: "O+",
        photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
        idUrl: "",
        idType: "Aadhaar",
        emergencyName: "Priya Sharma",
        emergencyPhone: "+91 98765 43211",
        emergencyRelation: "Spouse",
      },
      {
        id: "t-2",
        type: "companion" as const,
        name: "Priya Sharma",
        phone: "+91 98765 43211",
        email: "priya@email.com",
        dateOfBirth: "1992-08-22",
        gender: "Female",
        foodPreference: "vegetarian",
        allergies: "Peanuts",
        medicalConditions: "None",
        bloodGroup: "A+",
        photoUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face",
        idUrl: "",
        idType: "Aadhaar",
        emergencyName: "Rahul Sharma",
        emergencyPhone: "+91 98765 43210",
        emergencyRelation: "Spouse",
      },
    ],
    common: {
      groupNote: "Celebrating our 5th anniversary. Would love a quiet lake-facing room if possible.",
      modeOfArrival: "Train (Jammu Tawi)",
      needsTravelHelp: true,
    },
    onboardingComplete: true,
    paymentStatus: "paid" as const,
    paymentMethod: "razorpay" as const,
  };
  localStorage.setItem(key, JSON.stringify(demo));

  const demo2 = {
    departureCode: "KOD5-APR18",
    travelers: [
      {
        id: "t-3",
        type: "primary" as const,
        name: "Arun Kumar",
        phone: "+91 99887 76655",
        email: "arun@email.com",
        dateOfBirth: "1985-03-10",
        gender: "Male",
        foodPreference: "non-vegetarian",
        allergies: "None",
        medicalConditions: "Mild asthma",
        bloodGroup: "B+",
        photoUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face",
        idUrl: "",
        idType: "Passport",
        emergencyName: "Meera Kumar",
        emergencyPhone: "+91 99887 76656",
        emergencyRelation: "Sister",
      },
    ],
    common: {
      groupNote: "First solo trip. Excited!",
      modeOfArrival: "Flight (Madurai)",
      needsTravelHelp: false,
    },
    onboardingComplete: false,
    paymentStatus: "cod" as const,
    paymentMethod: "cod" as const,
  };
  localStorage.setItem("urbandetox-booking-KOD5-APR18", JSON.stringify(demo2));
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState<BookingWithMeta[]>([]);
  const { clearUnread } = useBookingNotifications();

  useEffect(() => {
    clearUnread();
    seedDemoBookings();
    const t = setTimeout(() => {
      const raw = getAllBookings();
      const enriched = raw.map((b) => {
        const dep = getDepartureByCode(b.departureCode);
        const pkg = dep ? getPackageBySlug(dep.packageSlug) : undefined;
        const dest = dep ? getDestinationBySlug(dep.destinationSlug) : undefined;
        const primary = b.travelers.find((t) => t.type === "primary");
        return {
          ...b,
          id: b.departureCode,
          primaryName: primary?.name || "—",
          primaryPhone: primary?.phone || "",
          primaryEmail: primary?.email || "",
          travelerCount: b.travelers.length,
          packageSlug: dep?.packageSlug,
          packageTitle: pkg?.title,
          destinationName: dest?.name,
          startDate: dep?.startDate,
          endDate: dep?.endDate,
          price: dep?.offerPrice || dep?.price,
        };
      });
      setBookings(enriched);
    }, 0);
    return () => clearTimeout(t);
  }, [clearUnread]);

  const stats = useMemo(() => {
    const total = bookings.length;
    const complete = bookings.filter((b) => b.onboardingComplete).length;
    const pending = total - complete;
    const paid = bookings.filter((b) => b.paymentStatus === "paid").length;
    const cod = bookings.filter((b) => b.paymentStatus === "cod").length;
    const totalTravelers = bookings.reduce((sum, b) => sum + b.travelers.length, 0);
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
