"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Building2, GraduationCap } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

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
                For Teams
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.1]">
              Teams & <span className="text-brand">Groups</span>
            </h2>
          </div>
          <div className="lg:flex lg:items-end">
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed lg:max-w-md">
              Custom detox experiences for companies and universities. Designed for bonding, learning, and genuine rest.
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
        </motion.div>
      </div>
    </section>
  );
}
