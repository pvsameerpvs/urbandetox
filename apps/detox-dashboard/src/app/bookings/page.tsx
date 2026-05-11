"use client";

import { Card, CardContent } from "@urbandetox/ui";
import { formatPrice } from "@urbandetox/utils";
import { Users, CheckCircle2, Clock, AlertCircle } from "lucide-react";

const mockBookings = [
  { id: "B-001", customer: "Rahul Sharma", email: "rahul@email.com", trip: "Kashmir 3-Day Detox", code: "KAS3-JUN20", date: "Jun 20, 2026", travelers: 2, amount: 57000, status: "paid", onboarding: "completed" },
  { id: "B-002", customer: "Priya Menon", email: "priya@email.com", trip: "Kodaikanal 5-Day Detox", code: "KOD5-APR18", date: "Apr 18, 2026", travelers: 1, amount: 12500, status: "paid", onboarding: "pending" },
  { id: "B-003", customer: "Arun Kumar", email: "arun@email.com", trip: "Gokarna 3-Day Detox", code: "GOK-APR25", date: "Apr 25, 2026", travelers: 3, amount: 28500, status: "pending", onboarding: "pending" },
  { id: "B-004", customer: "Sneha Patel", email: "sneha@email.com", trip: "Kashmir 15-Day Detox", code: "KAS15-JUN01", date: "Jun 1, 2026", travelers: 1, amount: 78500, status: "paid", onboarding: "completed" },
  { id: "B-005", customer: "Vikram Rao", email: "vikram@email.com", trip: "Kodaikanal 6-Day Detox", code: "KOD6-APR25", date: "Apr 25, 2026", travelers: 2, amount: 31000, status: "paid", onboarding: "completed" },
  { id: "B-006", customer: "Ananya Nair", email: "ananya@email.com", trip: "North Kerala 3-Day", code: "NKL-JUL05", date: "Jul 5, 2026", travelers: 1, amount: 11000, status: "paid", onboarding: "pending" },
];

export default function BookingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Bookings</h1>
        <p className="text-sm text-muted-foreground mt-1">View and manage customer bookings.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-0 shadow-lg shadow-black/[0.03] bg-white rounded-2xl">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-emerald-100 p-2.5">
                <CheckCircle2 className="h-5 w-5 text-emerald-700" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Paid</p>
                <p className="text-xl font-bold">5</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg shadow-black/[0.03] bg-white rounded-2xl">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-amber-100 p-2.5">
                <Clock className="h-5 w-5 text-amber-700" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Payment Pending</p>
                <p className="text-xl font-bold">1</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg shadow-black/[0.03] bg-white rounded-2xl">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-blue-100 p-2.5">
                <AlertCircle className="h-5 w-5 text-blue-700" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Onboarding Pending</p>
                <p className="text-xl font-bold">3</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-0 shadow-lg shadow-black/[0.03] bg-white rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/40 bg-secondary/[0.03]">
                <th className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wider text-muted-foreground">Booking</th>
                <th className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wider text-muted-foreground">Trip</th>
                <th className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wider text-muted-foreground">Date</th>
                <th className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wider text-muted-foreground">Travelers</th>
                <th className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wider text-muted-foreground">Amount</th>
                <th className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wider text-muted-foreground">Payment</th>
                <th className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wider text-muted-foreground">Onboarding</th>
              </tr>
            </thead>
            <tbody>
              {mockBookings.map((b) => (
                <tr key={b.id} className="border-b border-border/30 hover:bg-secondary/[0.02] transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-medium text-xs">{b.customer}</p>
                    <p className="text-[10px] text-muted-foreground font-mono">{b.id}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-xs font-medium">{b.trip}</p>
                    <p className="text-[10px] text-muted-foreground font-mono">{b.code}</p>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{b.date}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1 text-xs">
                      <Users className="h-3.5 w-3.5 text-muted-foreground" /> {b.travelers}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs font-bold">{formatPrice(b.amount)}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      b.status === "paid" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                    }`}>
                      {b.status === "paid" ? <CheckCircle2 className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                      {b.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      b.onboarding === "completed" ? "bg-emerald-100 text-emerald-700" : "bg-blue-100 text-blue-700"
                    }`}>
                      {b.onboarding === "completed" ? <CheckCircle2 className="h-3 w-3" /> : <AlertCircle className="h-3 w-3" />}
                      {b.onboarding}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
