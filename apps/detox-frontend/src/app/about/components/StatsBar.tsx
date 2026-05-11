"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Mountain, Users, MapPin, Sunrise } from "lucide-react";
import { containerVariants, itemVariants } from "@/lib/animations";

const stats = [
  { label: "Detoxes Hosted", value: "50+", icon: Mountain },
  { label: "Happy Travelers", value: "600+", icon: Users },
  { label: "Destinations", value: "8", icon: MapPin },
  { label: "Years Running", value: "3", icon: Sunrise },
];



export function StatsBar() {
  return (
    <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 -mt-12 sm:-mt-16 relative z-20">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {stats.map((stat) => (
          <motion.div key={stat.label} variants={itemVariants}>
            <Card className="border-0 shadow-xl shadow-black/[0.06] bg-white rounded-2xl">
              <CardContent className="p-5 sm:p-6 flex flex-col items-center text-center">
                <div className="mb-3 inline-flex items-center justify-center rounded-xl bg-brand/10 p-3">
                  <stat.icon className="h-5 w-5 text-brand" />
                </div>
                <span className="text-2xl sm:text-3xl font-bold text-foreground mb-1">{stat.value}</span>
                <span className="text-xs sm:text-sm text-muted-foreground font-medium">{stat.label}</span>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
