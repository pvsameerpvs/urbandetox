"use client";

import { useState, useMemo } from "react";
import { Search, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@urbandetox/utils";
import type { GuideArticle } from "@urbandetox/utils";
import { GuideHero } from "./components/GuideHero";
import { GuideCard } from "./components/GuideCard";
import { FeaturedGuide } from "./components/FeaturedGuide";
import { Button, Input } from "@urbandetox/ui"

interface GuideListingClientProps {
  guides: GuideArticle[];
  categories: string[];
  featured: GuideArticle | undefined;
}

export function GuideListingClient({ guides, categories, featured }: GuideListingClientProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = useMemo(() => {
    let result = [...guides];
    if (activeCategory) result = result.filter((g) => g.category === activeCategory);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((g) => g.title.toLowerCase().includes(q) || g.excerpt.toLowerCase().includes(q) || g.category.toLowerCase().includes(q));
    }
    return result;
  }, [guides, activeCategory, searchQuery]);

  const nonFeaturedFiltered = filtered.filter((g) => !g.featured || g.id !== featured?.id);
  const showFeatured = featured && !activeCategory && !searchQuery.trim();

  return (
    <main className="min-h-screen bg-white">
      <GuideHero resultCount={filtered.length} />

      <div className="relative z-10 mx-auto max-w-4xl w-full px-4 sm:px-6 lg:px-8 -mt-12 sm:-mt-16 pb-12 sm:pb-16">
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }}>
          <div className="bg-white rounded-2xl shadow-2xl shadow-black/15 p-5 sm:p-6">
            <div className="relative mb-5">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input type="text" placeholder="Search guides, tips, destinations..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="h-14 pl-12 pr-4 rounded-xl bg-secondary/40 border-0 text-base font-medium placeholder:text-muted-foreground/70 focus-visible:ring-2 focus-visible:ring-brand/20" />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-secondary transition-colors">
                  <X className="h-4 w-4 text-muted-foreground" />
                </button>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mr-1">Categories</span>
              <button onClick={() => setActiveCategory(null)} className={cn("rounded-full px-4 py-2 text-sm font-medium transition-all border", !activeCategory ? "bg-brand text-brand-foreground border-brand shadow-md shadow-brand/10" : "bg-secondary/60 text-foreground border-transparent hover:bg-secondary")}>All</button>
              {categories.map((cat) => (
                <button key={cat} onClick={() => setActiveCategory(cat)} className={cn("rounded-full px-4 py-2 text-sm font-medium transition-all border", activeCategory === cat ? "bg-brand text-brand-foreground border-brand shadow-md shadow-brand/10" : "bg-secondary/60 text-foreground border-transparent hover:bg-secondary")}>{cat}</button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AnimatePresence>
            {showFeatured && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mb-12 sm:mb-16">
                <FeaturedGuide guide={featured} />
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold mb-1">{activeCategory || searchQuery ? "Results" : "All Guides"}</h2>
              <p className="text-sm text-muted-foreground">{filtered.length} {filtered.length === 1 ? "article" : "articles"} found</p>
            </div>
          </div>

          {filtered.length === 0 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl bg-secondary/[0.03] border border-border/40 py-20 text-center shadow-lg shadow-black/[0.03]">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary/50 mb-5">
                <Search className="h-7 w-7 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-bold mb-2">No guides found</h3>
              <p className="text-sm text-muted-foreground mb-6 max-w-sm mx-auto">Try adjusting your search or category filter.</p>
              <Button variant="outline" onClick={() => { setActiveCategory(null); setSearchQuery(""); }} className="rounded-full h-11 px-6">Reset Filters</Button>
            </motion.div>
          )}

          {filtered.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {(showFeatured ? nonFeaturedFiltered : filtered).map((guide) => (
                <GuideCard key={guide.id} guide={guide} />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
