"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Building2, GraduationCap } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@urbandetox/utils";
import { containerVariants, itemVariants } from "@/lib/animations";
import { Card, CardContent, Button } from "@urbandetox/ui";

export function CorporateUniversitySection() {
  return (
    <section className="py-16 sm:py-24 bg-secondary/[0.02]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-8 lg:gap-16 mb-6 sm:mb-12">
          <div>
            <div className="flex items-center gap-2 mb-2.5 sm:gap-3 sm:mb-5">
              <div className="h-px w-6 sm:w-10 bg-brand" />
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-brand">
                For Teams
              </span>
            </div>
            <h2 className="text-xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.15] sm:leading-[1.1]">
              Custom Detox Trips for{" "}
              <span className="text-brand">Teams & Colleges</span>
            </h2>
          </div>
          <div className="lg:flex lg:items-end">
            <p className="text-[13px] sm:text-lg text-muted-foreground leading-relaxed lg:max-w-md">
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
          className="grid grid-cols-2 gap-3 sm:gap-6"
        >
          {/* For Colleges */}
          <motion.div variants={itemVariants}>
            <Card className={cn("border-0 py-0 shadow-lg shadow-black/[0.03] bg-white h-full overflow-hidden" , "hover:shadow-xl transition-all duration-500")}>
              <div className="flex flex-col md:flex-row h-full">
                <div className="relative w-full shrink-0 h-[96px] sm:h-[180px] md:h-auto md:w-[30%]">
                  <Image src="https://images.unsplash.com/photo-1544531586-fde5298cdd40?q=80&w=800&auto=format&fit=crop" alt="College group trip" fill className="object-cover" sizes="(max-width: 768px) 50vw, 15vw" />
                </div>
                <CardContent className="w-full flex-1 md:w-[70%] p-3.5 sm:p-8 flex flex-col justify-center">
                  <div className="mb-3 sm:mb-4 hidden sm:inline-flex items-center justify-center rounded-2xl bg-brand/10 p-2 sm:p-3 w-fit">
                    <GraduationCap className="h-5 w-5 sm:h-6 sm:w-6 text-brand" />
                  </div>
                  <h3 className="min-h-[40px] sm:min-h-0 text-sm sm:text-2xl font-bold mb-2 sm:mb-3">For Colleges</h3>
                  <p className="line-clamp-3 sm:line-clamp-none text-xs sm:text-base text-muted-foreground leading-relaxed mb-3 sm:mb-6">
                    Offbeat student trips built around nature, adventure and group bonding, coordinated end to end.
                  </p>
                  <Button variant="outline" className="mt-auto h-11 w-full px-2 text-xs font-semibold sm:w-fit sm:px-5 sm:text-sm" asChild>
                    <Link href="/university-trips">Learn More <ArrowRight className="ml-1.5 h-3.5 w-3.5 sm:ml-2 sm:h-4 sm:w-4" /></Link>
                  </Button>
                </CardContent>
              </div>
            </Card>
          </motion.div>

          {/* For Corporate Teams */}
          <motion.div variants={itemVariants}>
            <Card className={cn("border-0 shadow-lg py-0 shadow-black/[0.03] bg-white h-full overflow-hidden", "hover:shadow-xl transition-all duration-500")}>
              <div className="flex flex-col md:flex-row h-full">
                <div className="relative w-full shrink-0 h-[96px] sm:h-[180px] md:h-auto md:w-[30%]">
                  <Image src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800&auto=format&fit=crop" alt="Corporate team retreat" fill className="object-cover" sizes="(max-width: 768px) 50vw, 15vw" />
                </div>
                <CardContent className="w-full flex-1 md:w-[70%] p-3.5 sm:p-8 flex flex-col justify-center">
                  <div className="mb-3 sm:mb-4 hidden sm:inline-flex items-center justify-center rounded-2xl bg-brand/10 p-2 sm:p-3 w-fit">
                    <Building2 className="h-5 w-5 sm:h-6 sm:w-6 text-brand" />
                  </div>
                  <h3 className="min-h-[40px] sm:min-h-0 text-sm sm:text-2xl font-bold mb-2 sm:mb-3">For Corporate Teams</h3>
                  <p className="line-clamp-3 sm:line-clamp-none text-xs sm:text-base text-muted-foreground leading-relaxed mb-3 sm:mb-6">
                    Detox trips for office teams who need a real break from work, screens, and routine. Perfect for team bonding, retreats, and reset weekends.
                  </p>
                  <Button variant="outline" className="mt-auto h-11 w-full px-2 text-xs font-semibold sm:w-fit sm:px-5 sm:text-sm" asChild>
                    <Link href="/corporate-retreats">Learn More <ArrowRight className="ml-1.5 h-3.5 w-3.5 sm:ml-2 sm:h-4 sm:w-4" /></Link>
                  </Button>
                </CardContent>
              </div>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
