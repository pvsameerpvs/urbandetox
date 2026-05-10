"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { fetchGuides, fetchGuideCategories, fetchFeaturedGuides } from "@/lib/data";
import { BookOpen, ArrowRight } from "lucide-react";

export default function GuideListingPage() {
  const guides = fetchGuides();
  const categories = fetchGuideCategories();
  const featured = fetchFeaturedGuides(1)[0];
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filtered = useMemo(() => {
    if (!activeCategory) return guides;
    return guides.filter((g) => g.category === activeCategory);
  }, [guides, activeCategory]);

  return (
    <section className="py-10 sm:py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Guide</h1>
          <p className="mt-2 text-muted-foreground">
            Destination wisdom, travel tips, and seasonal insights to prepare you for the journey.
          </p>
        </div>

        {/* Featured */}
        {featured && !activeCategory && (
          <div className="mb-10">
            <Link href={`/guide/${featured.slug}`} className="group block">
              <Card className="overflow-hidden border-border/60 bg-card">
                <div className="grid grid-cols-1 md:grid-cols-2">
                  <div className="relative aspect-[16/10] md:aspect-auto overflow-hidden">
                    <img
                      src={featured.image}
                      alt={featured.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <CardContent className="flex flex-col justify-center p-6 sm:p-8">
                    <Badge className="mb-3 w-fit bg-brand text-brand-foreground">Featured</Badge>
                    <p className="text-sm text-brand mb-1">{featured.category}</p>
                    <h2 className="text-2xl font-semibold tracking-tight mb-3">{featured.title}</h2>
                    <p className="text-muted-foreground leading-relaxed mb-4">{featured.excerpt}</p>
                    <p className="text-sm font-medium text-brand group-hover:underline">Read guide <ArrowRight className="inline h-3.5 w-3.5" /></p>
                  </CardContent>
                </div>
              </Card>
            </Link>
          </div>
        )}

        {/* Category chips */}
        <div className="mb-8 flex flex-wrap gap-2">
          <button
            onClick={() => setActiveCategory(null)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors border ${
              !activeCategory
                ? "bg-brand text-brand-foreground border-brand"
                : "bg-card text-muted-foreground border-border hover:border-brand/40"
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors border ${
                activeCategory === cat
                  ? "bg-brand text-brand-foreground border-brand"
                  : "bg-card text-muted-foreground border-border hover:border-brand/40"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((guide) => (
            <Link key={guide.id} href={`/guide/${guide.slug}`} className="group">
              <Card className="overflow-hidden border-border/60 bg-card h-full transition-shadow hover:shadow-md">
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img
                    src={guide.image}
                    alt={guide.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <CardContent className="p-5">
                  <div className="mb-2 flex items-center gap-1.5 text-xs font-medium text-brand">
                    <BookOpen className="h-3.5 w-3.5" />
                    {guide.category}
                  </div>
                  <h3 className="text-base font-semibold leading-snug mb-2">{guide.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">{guide.excerpt}</p>
                  <p className="mt-3 text-sm font-medium text-brand group-hover:underline">Read guide</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
