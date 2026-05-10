import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Calendar, CheckCircle, Clock, AlertCircle, ArrowRight } from "lucide-react";

const mockTrips = [
  {
    id: "trip-1",
    packageTitle: "Kodai 3-Day Detox",
    destination: "Kodaikanal",
    dates: "Oct 10 to 12, 2026",
    status: "upcoming",
    onboarding: "completed",
    payment: "paid",
    image: "https://images.unsplash.com/photo-1567359781514-3b964e2b04d6?q=80&w=400&auto=format&fit=crop",
  },
  {
    id: "trip-2",
    packageTitle: "North Kerala Detox",
    destination: "North Kerala",
    dates: "Sep 12 to 14, 2026",
    status: "upcoming",
    onboarding: "pending",
    payment: "paid",
    image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=400&auto=format&fit=crop",
  },
  {
    id: "trip-3",
    packageTitle: "Kodai 2-Day Detox",
    destination: "Kodaikanal",
    dates: "Jan 15 to 16, 2025",
    status: "completed",
    onboarding: "completed",
    payment: "paid",
    image: "https://images.unsplash.com/photo-1595658658481-51fc2c627e23?q=80&w=400&auto=format&fit=crop",
  },
];

export default function MyDetoxPage() {
  return (
    <section className="py-10 sm:py-14">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl mb-2">My Detox</h1>
        <p className="text-muted-foreground mb-8">Your upcoming trips, past memories, and pending actions.</p>

        <div className="space-y-6">
          {mockTrips.map((trip) => (
            <Card key={trip.id} className="overflow-hidden border-border/60 bg-card">
              <div className="grid grid-cols-1 md:grid-cols-4">
                <div className="relative aspect-[16/10] md:aspect-auto overflow-hidden">
                  <img src={trip.image} alt={trip.packageTitle} className="h-full w-full object-cover" />
                </div>
                <CardContent className="p-5 md:col-span-3 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge
                        variant={trip.status === "upcoming" ? "default" : "secondary"}
                        className={trip.status === "upcoming" ? "bg-brand text-brand-foreground" : ""}
                      >
                        {trip.status === "upcoming" ? "Upcoming" : "Completed"}
                      </Badge>
                      {trip.onboarding === "pending" && (
                        <Badge variant="destructive" className="text-[10px]">Onboarding Pending</Badge>
                      )}
                    </div>
                    <h3 className="text-lg font-semibold">{trip.packageTitle}</h3>
                    <p className="text-sm text-muted-foreground">{trip.destination} · {trip.dates}</p>
                  </div>
                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    {trip.status === "upcoming" && trip.onboarding === "pending" && (
                      <Button size="sm" className="bg-brand text-brand-foreground hover:bg-brand/90" asChild>
                        <Link href="/book/KOD2-MAY10/onboarding">Complete Onboarding <ArrowRight className="ml-1 h-3.5 w-3.5" /></Link>
                      </Button>
                    )}
                    {trip.status === "upcoming" && trip.onboarding === "completed" && (
                      <div className="flex items-center gap-1.5 text-xs text-brand">
                        <CheckCircle className="h-3.5 w-3.5" /> Onboarding done
                      </div>
                    )}
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      {trip.payment === "paid" ? (
                        <>
                          <CheckCircle className="h-3.5 w-3.5" /> Payment confirmed
                        </>
                      ) : (
                        <>
                          <AlertCircle className="h-3.5 w-3.5" /> Payment pending
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </div>
            </Card>
          ))}
        </div>

        <Separator className="my-10" />

        <div className="rounded-xl bg-secondary/40 p-6 text-center sm:p-8">
          <h3 className="text-lg font-semibold mb-2">Ready for another reset?</h3>
          <p className="text-muted-foreground mb-4">Browse upcoming detoxes and find your next date.</p>
          <Button className="bg-brand text-brand-foreground hover:bg-brand/90" asChild>
            <Link href="/detox">Explore Detox <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
