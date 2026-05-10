"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Building2, GraduationCap } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function CorporateUniversitySection() {
  return (
    <section className="py-20 sm:py-28 bg-secondary/[0.02]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Elegant Header */}
        <div className="mb-14 max-w-xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px w-8 bg-brand" />
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-brand">
              For Teams
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-[2.5rem] font-bold tracking-tight leading-tight">
            Teams & <span className="text-brand">Groups</span>
          </h2>
          <p className="mt-3 text-muted-foreground text-base sm:text-lg leading-relaxed">
            Custom experiences designed for deeper connection.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Card
              className={cn(
                "border-0 shadow-lg shadow-black/[0.03] bg-white h-full",
                "hover:shadow-xl hover:shadow-black/[0.06] transition-all duration-500"
              )}
            >
              <CardContent className="p-8">
                <div className="mb-5 inline-flex items-center justify-center rounded-2xl bg-brand/10 p-4">
                  <Building2 className="h-7 w-7 text-brand" />
                </div>
                <h3 className="text-2xl font-bold mb-3">Corporate Retreats</h3>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  Take your team off the grid. Custom detox-style retreats designed for deeper bonding,
                  creative thinking, and genuine rest. We handle logistics, you bring the people.
                </p>
                <Button
                  variant="outline"
                  className="h-11 px-5 text-sm font-semibold"
                  asChild
                >
                  <Link href="/corporate-retreats">
                    Learn More <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Card
              className={cn(
                "border-0 shadow-lg shadow-black/[0.03] bg-white h-full",
                "hover:shadow-xl hover:shadow-black/[0.06] transition-all duration-500"
              )}
            >
              <CardContent className="p-8">
                <div className="mb-5 inline-flex items-center justify-center rounded-2xl bg-brand/10 p-4">
                  <GraduationCap className="h-7 w-7 text-brand" />
                </div>
                <h3 className="text-2xl font-bold mb-3">University Trips</h3>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  Educational journeys that balance learning with lived experience. Faculty-led modules,
                  safety protocols, and destinations that teach without classrooms.
                </p>
                <Button
                  variant="outline"
                  className="h-11 px-5 text-sm font-semibold"
                  asChild
                >
                  <Link href="/university-trips">
                    Learn More <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
