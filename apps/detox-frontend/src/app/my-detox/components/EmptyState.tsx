"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Search, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export function EmptyState() {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl bg-secondary/[0.03] border border-border/40 py-16 sm:py-20 text-center">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary/50 mb-5">
        <Search className="h-7 w-7 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-bold mb-2">No trips yet</h3>
      <p className="text-sm text-muted-foreground mb-6 max-w-sm mx-auto">You have not booked any detox trips yet. Browse our curated escapes and find your reset.</p>
      <Button className="rounded-xl bg-brand text-brand-foreground hover:bg-brand/90 h-11 px-7 text-sm font-semibold shadow-lg shadow-brand/10" asChild>
        <Link href="/detox">Explore Detox <ArrowRight className="ml-2 h-4 w-4" /></Link>
      </Button>
    </motion.div>
  );
}
