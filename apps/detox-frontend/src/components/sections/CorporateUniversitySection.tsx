"use client";

import Link from "next/link";
import { ArrowRight, Building2, GraduationCap } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@urbandetox/utils";
import { containerVariants, itemVariants } from "@/lib/animations";
import { Card, CardContent, Button } from "@urbandetox/ui";

export function CorporateUniversitySection() {
  return (
    <section className="py-24 sm:py-32 bg-secondary/[0.02]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 mb-16 sm:mb-20">
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="h-px w-10 bg-brand" />
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-brand">
                Custom Detox Trips
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.1]">
              for Teams
              <span className="text-brand"> & Colleges</span>
            </h2>
          </div>
          <div className="lg:flex lg:items-end">
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed lg:max-w-md">
              We&apos;ve already hosted detox-style trips for college groups and corporate teams.
              Whether it&apos;s a student batch, office team, or private group, we create offbeat
              experiences that feel fresh, safe, and easy to manage.
            </p>
          </div>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 gap-6 md:grid-cols-2"
        >
          <motion.div variants={itemVariants}>
            <Card
              className={cn(
                "border-0 shadow-lg shadow-black/[0.03] bg-white h-full",
                "hover:shadow-xl transition-all duration-500"
              )}
            >
              <CardContent className="p-8">
                <div className="mb-5 inline-flex items-center justify-center rounded-2xl bg-brand/10 p-4">
                  <GraduationCap className="h-7 w-7 text-brand" />
                </div>
                <h3 className="text-2xl font-bold mb-3">For Colleges</h3>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  Offbeat student trips with nature, adventure, group bonding, and safe
                  coordination from start to finish.
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

          <motion.div variants={itemVariants}>
            <Card
              className={cn(
                "border-0 shadow-lg shadow-black/[0.03] bg-white h-full",
                "hover:shadow-xl transition-all duration-500"
              )}
            >
              <CardContent className="p-8">
                <div className="mb-5 inline-flex items-center justify-center rounded-2xl bg-brand/10 p-4">
                  <Building2 className="h-7 w-7 text-brand" />
                </div>
                <h3 className="text-2xl font-bold mb-3">For Corporate Teams</h3>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  Detox trips for office teams who need a real break from work, screens, and
                  routine. Perfect for team bonding, retreats, and reset weekends.
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
        </motion.div>
      </div>
    </section>
  );
}
