"use client";

import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { fetchUpcomingDepartures } from "@/lib/data";
import { getPackageBySlug } from "@/data/packages";
import { getDestinationBySlug } from "@/data/destinations";
import { formatPrice, formatDateRange } from "@/lib/formatters";
import { Calendar, Users, ArrowRight, Flame, Star } from "lucide-react";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

export function UpcomingDetoxSection() {
  const departures = fetchUpcomingDepartures(6);

  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-4 mb-12">
          <div>
            <Badge variant="secondary" className="mb-3 text-xs font-medium">
              <Star className="mr-1 h-3 w-3" /> Upcoming Departures
            </Badge>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Upcoming Detox</h2>
            <p className="mt-2 text-muted-foreground text-lg">
              Choose your date. We handle the rest.
            </p>
          </div>
          <Button variant="outline" className="hidden sm:flex h-11" asChild>
            <Link href="/detox">View All <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {departures.map((dep) => {
            const pkg = getPackageBySlug(dep.packageSlug);
            const dest = getDestinationBySlug(dep.destinationSlug);
            if (!pkg || !dest) return null;

            const isFull = dep.status === "full";
            const isFilling = dep.status === "filling";

            return (
              <motion.div key={dep.id} variants={itemVariants}>
                <Card className="group overflow-hidden border-0 shadow-lg shadow-black/5 bg-card hover:shadow-xl hover:shadow-black/10 transition-all duration-500">
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image
                      src={pkg.coverImage}
                      alt={pkg.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-white/95 text-foreground backdrop-blur-sm shadow-sm font-medium">
                        {dest.name}
                      </Badge>
                    </div>
                    {isFilling && (
                      <div className="absolute top-4 right-4">
                        <Badge variant="destructive" className="text-xs font-medium shadow-sm">
                          <Flame className="mr-1 h-3 w-3" /> Filling Fast
                        </Badge>
                      </div>
                    )}
                    {isFull && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                        <Badge className="text-sm px-4 py-2 bg-white/20 text-white border-white/30 backdrop-blur-md">
                          Full — Join Waitlist
                        </Badge>
                      </div>
                    )}
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                      <Calendar className="h-4 w-4 text-brand" />
                      <span className="font-medium text-foreground">{formatDateRange(dep.startDate, dep.endDate)}</span>
                    </div>
                    <h3 className="text-lg font-semibold leading-snug mb-1">{pkg.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{pkg.subtitle}</p>
                    
                    <div className="flex items-center justify-between mb-5">
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-brand">{formatPrice(dep.offerPrice ?? dep.price)}</span>
                        {dep.offerPrice && dep.offerPrice < dep.price && (
                          <span className="text-sm text-muted-foreground line-through">{formatPrice(dep.price)}</span>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        <Users className="h-4 w-4" />
                        <span>{isFull ? "Waitlist" : `${dep.seatsLeft} left`}</span>
                      </div>
                    </div>

                    <Button
                      className="w-full bg-brand text-brand-foreground hover:bg-brand/90 h-11 text-sm font-medium"
                      disabled={isFull}
                      asChild
                    >
                      <Link href={`/book/${dep.code}`}>
                        {isFull ? "Join Waitlist" : "Book This Detox"}
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        <div className="mt-10 sm:hidden">
          <Button variant="outline" className="w-full h-11" asChild>
            <Link href="/detox">View All Upcoming Detox</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
