"use client";

import { useParams, notFound } from "next/navigation";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { fetchGuideBySlug, fetchRelatedGuides, fetchDestinationBySlug, fetchPackageBySlug } from "@/lib/data";
import { ArrowLeft, BookOpen, MapPin, ArrowRight } from "lucide-react";

export default function GuideDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const guide = fetchGuideBySlug(slug);

  if (!guide) {
    notFound();
  }

  const dest = guide.destinationSlug ? fetchDestinationBySlug(guide.destinationSlug) : undefined;
  const related = fetchRelatedGuides(guide.slug, 3);
  const relatedPackages = guide.relatedPackageSlugs
    ?.map((s) => fetchPackageBySlug(s))
    .filter(Boolean);

  return (
    <section className="py-10 sm:py-14">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <Button variant="ghost" size="sm" className="mb-6" asChild>
          <Link href="/guide">
            <ArrowLeft className="mr-2 h-4 w-4" /> All Guides
          </Link>
        </Button>

        {guide.image && (
          <div className="mb-8 aspect-[16/9] overflow-hidden rounded-xl">
            <img src={guide.image} alt={guide.title} className="h-full w-full object-cover" />
          </div>
        )}

        <div className="mb-2 flex items-center gap-2 text-sm text-brand">
          <BookOpen className="h-4 w-4" />
          <span className="font-medium">{guide.category}</span>
          {dest && (
            <>
              <span className="text-muted-foreground">·</span>
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" /> {dest.name}
              </span>
            </>
          )}
        </div>

        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl mb-4">{guide.title}</h1>
        <p className="text-lg text-muted-foreground leading-relaxed mb-8">{guide.excerpt}</p>

        <Separator className="mb-8" />

        <article className="prose prose-stone max-w-none">
          {guide.content.split("\n\n").map((paragraph, i) => {
            if (paragraph.startsWith("**") && paragraph.endsWith("**")) {
              return (
                <h3 key={i} className="text-xl font-semibold mt-8 mb-3">
                  {paragraph.replace(/\*\*/g, "")}
                </h3>
              );
            }
            if (paragraph.startsWith("- ")) {
              return (
                <ul key={i} className="my-4 list-disc pl-6 space-y-1">
                  {paragraph.split("\n").map((line, j) => (
                    <li key={j} className="text-muted-foreground leading-relaxed">
                      {line.replace("- ", "")}
                    </li>
                  ))}
                </ul>
              );
            }
            return (
              <p key={i} className="text-muted-foreground leading-relaxed mb-4">
                {paragraph}
              </p>
            );
          })}
        </article>

        {relatedPackages && relatedPackages.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl font-semibold mb-4">Related Detox</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {relatedPackages.map((pkg) => (
                <Link key={pkg!.slug} href={`/detox/${pkg!.slug}`} className="group">
                  <Card className="overflow-hidden border-border/60 bg-card">
                    <div className="aspect-[16/10] overflow-hidden">
                      <img src={pkg!.coverImage} alt={pkg!.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    </div>
                    <CardContent className="p-4">
                      <p className="text-sm font-medium">{pkg!.title}</p>
                      <p className="text-xs text-muted-foreground mt-1">{pkg!.durationLabel}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}

        {related.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl font-semibold mb-4">More Guides</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {related.map((g) => (
                <Link key={g.id} href={`/guide/${g.slug}`} className="group">
                  <Card className="overflow-hidden border-border/60 bg-card h-full">
                    <div className="aspect-[16/10] overflow-hidden">
                      <img src={g.image} alt={g.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    </div>
                    <CardContent className="p-4">
                      <p className="text-xs text-brand mb-1">{g.category}</p>
                      <p className="text-sm font-medium">{g.title}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="mt-12 rounded-xl bg-brand p-6 text-center sm:p-8">
          <h3 className="text-xl font-semibold text-white mb-2">Ready to detox?</h3>
          <p className="text-white/80 mb-4">Explore upcoming departures and book your reset.</p>
          <Button className="bg-white text-brand hover:bg-white/90" asChild>
            <Link href="/detox">Explore Detox <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
