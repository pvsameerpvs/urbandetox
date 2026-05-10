import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { fetchFeaturedGuides } from "@/lib/data";
import { ArrowRight, BookOpen } from "lucide-react";

export function GuideHighlightsSection() {
  const guides = fetchFeaturedGuides(4);

  return (
    <section className="py-16 sm:py-20 bg-secondary/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-4 mb-10">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Guide Highlights</h2>
            <p className="mt-2 text-muted-foreground">
              Destination wisdom, packing tips, and seasonal insights.
            </p>
          </div>
          <Button variant="outline" className="hidden sm:flex" asChild>
            <Link href="/guide">All Guides <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {guides.map((guide) => (
            <Link key={guide.id} href={`/guide/${guide.slug}`} className="group">
              <Card className="overflow-hidden border-border/60 bg-card transition-shadow hover:shadow-md h-full">
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img
                    src={guide.image}
                    alt={guide.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <CardContent className="p-5">
                  <div className="mb-2 inline-flex items-center gap-1.5 text-xs font-medium text-brand">
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

        <div className="mt-8 sm:hidden">
          <Button variant="outline" className="w-full" asChild>
            <Link href="/guide">All Guides</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
