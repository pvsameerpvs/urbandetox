"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { fetchGuides, fetchGuideCategories, fetchFeaturedGuides } from "@/lib/data";
import { BookOpen, ArrowRight, Search, Clock, User, Tag, X, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

/* ─── Guide Card ─────────────────────────────── */
function GuideCard({ guide, index }: { guide: ReturnType<typeof fetchGuides>[number]; index: number }) {
  return (
    <motion.div variants={itemVariants}>
      <Link href={`/guide/${guide.slug}`} className="group block h-full">
        <Card
          className={cn(
            "overflow-hidden border-0 shadow-lg shadow-black/[0.03] bg-white h-full",
            "hover:shadow-xl transition-all duration-500"
          )}
        >
          {/* Image */}
          <div className="relative h-[200px] sm:h-[220px] overflow-hidden">
            <Image
              src={guide.image}
              alt={guide.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute top-3 left-3">
              <Badge className="bg-white/95 text-foreground shadow-sm font-medium text-xs backdrop-blur-sm">
                <BookOpen className="mr-1 h-3 w-3" />
                {guide.category}
              </Badge>
            </div>
            {guide.featured && (
              <div className="absolute top-3 right-3">
                <Badge className="bg-brand text-brand-foreground shadow-sm font-medium text-xs">
                  <Sparkles className="mr-1 h-3 w-3" />
                  Featured
                </Badge>
              </div>
            )}
          </div>

          {/* Content */}
          <CardContent className="p-5 sm:p-6 flex flex-col h-[calc(100%-220px)]">
            <h3 className="text-base font-bold leading-snug mb-2 group-hover:text-brand transition-colors">
              {guide.title}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 mb-4 flex-1">
              {guide.excerpt}
            </p>
            <div className="flex items-center justify-between pt-3 border-t border-border/30">
              <span className="text-xs text-muted-foreground inline-flex items-center gap-1">
                <Clock className="h-3 w-3" /> 5 min read
              </span>
              <span className="text-sm font-semibold text-brand inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                Read <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}

/* ─── Featured Guide Card (Large) ──────────── */
function FeaturedGuide({ guide }: { guide: ReturnType<typeof fetchGuides>[number] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Link href={`/guide/${guide.slug}`} className="group block">
        <Card className="overflow-hidden border-0 shadow-xl shadow-black/[0.05] bg-white">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Image */}
            <div className="relative h-[280px] sm:h-[360px] lg:h-auto overflow-hidden">
              <Image
                src={guide.image}
                alt={guide.title}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/20 lg:bg-gradient-to-l" />
              <div className="absolute top-4 left-4">
                <Badge className="bg-brand text-brand-foreground shadow-lg font-semibold text-xs">
                  <Sparkles className="mr-1.5 h-3.5 w-3.5" />
                  Featured Guide
                </Badge>
              </div>
            </div>

            {/* Content */}
            <CardContent className="flex flex-col justify-center p-6 sm:p-10 lg:p-12">
              <div className="inline-flex items-center gap-2 text-sm font-medium text-brand mb-3">
                <Tag className="h-4 w-4" />
                {guide.category}
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold leading-tight mb-4 group-hover:text-brand transition-colors">
                {guide.title}
              </h2>
              <p className="text-base text-muted-foreground leading-relaxed mb-6">
                {guide.excerpt}
              </p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="h-4 w-4" /> 8 min read
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <User className="h-4 w-4" /> Urban Detox Team
                </span>
              </div>
              <Button
                className="w-fit rounded-xl bg-brand text-brand-foreground hover:bg-brand/90 h-11 px-6 shadow-lg shadow-brand/10"
              >
                Read Full Guide <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </div>
        </Card>
      </Link>
    </motion.div>
  );
}

/* ─── Hero with Search ───────────────────────── */
function HeroWithSearch({
  searchQuery,
  setSearchQuery,
  activeCategory,
  setActiveCategory,
  categories,
  resultCount,
}: {
  searchQuery: string;
  setSearchQuery: (v: string) => void;
  activeCategory: string | null;
  setActiveCategory: (v: string | null) => void;
  categories: string[];
  resultCount: number;
}) {
  return (
    <div className="relative min-h-[70vh] sm:min-h-[60vh] flex flex-col overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=2000&auto=format&fit=crop"
          alt="Travel Guide"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/70" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col justify-center items-center text-center px-4 sm:px-6 lg:px-8 pt-24 pb-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-3xl"
        >
          <div className="inline-flex items-center gap-3 mb-6">
            <span className="h-px w-8 bg-white/40" />
            <span className="text-sm font-semibold uppercase tracking-[0.2em] text-white/70">
              Resources
            </span>
            <span className="h-px w-8 bg-white/40" />
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-[1.1] mb-5">
            Travel <span className="text-white/80">Guide</span>
          </h1>

          <p className="text-base sm:text-lg text-white/70 leading-relaxed max-w-xl mx-auto mb-2">
            Destination wisdom, travel tips, and seasonal insights to prepare you for the journey.
          </p>

          <p className="text-sm text-white/50">
            {resultCount} {resultCount === 1 ? "article" : "articles"}
          </p>
        </motion.div>
      </div>

      {/* Search + Category Card */}
      <div className="relative z-10 mx-auto max-w-4xl w-full px-4 sm:px-6 lg:px-8 pb-12 sm:pb-16">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <div className="bg-white rounded-2xl shadow-2xl shadow-black/15 p-5 sm:p-6">
            {/* Search */}
            <div className="relative mb-5">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search guides, tips, destinations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-14 pl-12 pr-4 rounded-xl bg-secondary/40 border-0 text-base font-medium placeholder:text-muted-foreground/70 focus-visible:ring-2 focus-visible:ring-brand/20"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-secondary transition-colors"
                >
                  <X className="h-4 w-4 text-muted-foreground" />
                </button>
              )}
            </div>

            {/* Categories */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mr-1">
                Categories
              </span>
              <button
                onClick={() => setActiveCategory(null)}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-medium transition-all border",
                  !activeCategory
                    ? "bg-brand text-brand-foreground border-brand shadow-md shadow-brand/10"
                    : "bg-secondary/60 text-foreground border-transparent hover:bg-secondary"
                )}
              >
                All
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={cn(
                    "rounded-full px-4 py-2 text-sm font-medium transition-all border",
                    activeCategory === cat
                      ? "bg-brand text-brand-foreground border-brand shadow-md shadow-brand/10"
                      : "bg-secondary/60 text-foreground border-transparent hover:bg-secondary"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

/* ─── Main Page ──────────────────────────────── */
export default function GuideListingPage() {
  const guides = useMemo(() => fetchGuides(), []);
  const categories = useMemo(() => fetchGuideCategories(), []);
  const featured = useMemo(() => fetchFeaturedGuides(1)[0], []);

  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = useMemo(() => {
    let result = [...guides];

    if (activeCategory) {
      result = result.filter((g) => g.category === activeCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (g) =>
          g.title.toLowerCase().includes(q) ||
          g.excerpt.toLowerCase().includes(q) ||
          g.category.toLowerCase().includes(q)
      );
    }

    return result;
  }, [guides, activeCategory, searchQuery]);

  const nonFeaturedFiltered = filtered.filter((g) => !g.featured || g.id !== featured?.id);
  const showFeatured = featured && !activeCategory && !searchQuery.trim();

  return (
    <main className="min-h-screen bg-white">
      {/* Hero with search & categories */}
      <HeroWithSearch
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        categories={categories}
        resultCount={filtered.length}
      />

      {/* Content */}
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Featured */}
          <AnimatePresence>
            {showFeatured && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-12 sm:mb-16"
              >
                <FeaturedGuide guide={featured} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Results header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold mb-1">
                {activeCategory || searchQuery ? "Results" : "All Guides"}
              </h2>
              <p className="text-sm text-muted-foreground">
                {filtered.length} {filtered.length === 1 ? "article" : "articles"} found
              </p>
            </div>
          </div>

          {/* Empty state */}
          {filtered.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl bg-secondary/[0.03] border border-border/40 py-20 text-center shadow-lg shadow-black/[0.03]"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary/50 mb-5">
                <Search className="h-7 w-7 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-bold mb-2">No guides found</h3>
              <p className="text-sm text-muted-foreground mb-6 max-w-sm mx-auto">
                Try adjusting your search or category filter.
              </p>
              <Button
                variant="outline"
                onClick={() => { setActiveCategory(null); setSearchQuery(""); }}
                className="rounded-full h-11 px-6"
              >
                Reset Filters
              </Button>
            </motion.div>
          )}

          {/* Grid */}
          {filtered.length > 0 && (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {(showFeatured ? nonFeaturedFiltered : filtered).map((guide, index) => (
                <GuideCard key={guide.id} guide={guide} index={index} />
              ))}
            </motion.div>
          )}
        </div>
      </section>
    </main>
  );
}
