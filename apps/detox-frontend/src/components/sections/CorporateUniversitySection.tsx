"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Building2, GraduationCap } from "lucide-react";
import { motion } from "framer-motion";

export function CorporateUniversitySection() {
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-14 max-w-xl"
        >
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">For Teams & Groups</h2>
          <p className="mt-3 text-muted-foreground text-lg">
            Custom experiences designed for deeper connection.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Card className="border-0 shadow-lg shadow-black/5 bg-card h-full hover:shadow-xl hover:shadow-black/10 transition-all duration-500">
              <CardContent className="p-8">
                <div className="mb-5 inline-flex items-center justify-center rounded-2xl bg-brand/10 p-4">
                  <Building2 className="h-7 w-7 text-brand" />
                </div>
                <h3 className="text-2xl font-semibold mb-3">Corporate Retreats</h3>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  Take your team off the grid. Custom detox-style retreats designed for deeper bonding, 
                  creative thinking, and genuine rest. We handle logistics, you bring the people.
                </p>
                <Button variant="outline" className="h-11" asChild>
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
            <Card className="border-0 shadow-lg shadow-black/5 bg-card h-full hover:shadow-xl hover:shadow-black/10 transition-all duration-500">
              <CardContent className="p-8">
                <div className="mb-5 inline-flex items-center justify-center rounded-2xl bg-brand/10 p-4">
                  <GraduationCap className="h-7 w-7 text-brand" />
                </div>
                <h3 className="text-2xl font-semibold mb-3">University Trips</h3>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  Educational journeys that balance learning with lived experience. Faculty-led modules, 
                  safety protocols, and destinations that teach without classrooms.
                </p>
                <Button variant="outline" className="h-11" asChild>
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
