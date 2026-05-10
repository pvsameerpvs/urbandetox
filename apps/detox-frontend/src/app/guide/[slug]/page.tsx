"use client";

import { useParams, notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

import { Separator } from "@/components/ui/separator";
import { fetchGuideBySlug, fetchRelatedGuides, fetchDestinationBySlug } from "@/lib/data";
import { RelatedPackageCard } from "./components/RelatedPackageCard";
import { RelatedGuideCard } from "./components/RelatedGuideCard";
import { GuideCTA } from "./components/GuideCTA";
import Image from "next/image";
import { ArrowLeft, BookOpen, MapPin } from "lucide-react";

export default function GuideDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const guide = fetchGuideBySlug(slug);

  if (!guide) notFound();

  const dest = guide.destinationSlug ? fetchDestinationBySlug(guide.destinationSlug) : undefined;
  const related = fetchRelatedGuides(guide.slug, 3);

  return (
    <section className="py-8 sm:py-10 md:py-14">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <Button variant="ghost" size="sm" className="mb-4 sm:mb-6" asChild>
          <Link href="/guide"><ArrowLeft className="mr-2 h-4 w-4" /> All Guides</Link>
        </Button>

        {guide.image && (
          <div className="mb-6 sm:mb-8 aspect-[16/9] overflow-hidden rounded-xl relative">
            <Image src={guide.image} alt={guide.title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 800px" />
          </div>
        )}

        <div className="mb-2 flex items-center gap-2 text-sm text-brand flex-wrap">
          <BookOpen className="h-4 w-4" />
          <span className="font-medium">{guide.category}</span>
          {dest && <><span className="text-muted-foreground">·</span><span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {dest.name}</span></>}
        </div>

        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight sm:text-4xl mb-4">{guide.title}</h1>
        <p className="text-base sm:text-lg text-muted-foreground leading-relaxed mb-6 sm:mb-8">{guide.excerpt}</p>

        <Separator className="mb-6 sm:mb-8" />

        <article className="prose prose-stone max-w-none">
          {guide.content.split("\n\n").map((paragraph, i) => {
            if (paragraph.startsWith("**") && paragraph.endsWith("**")) {
              return <h3 key={i} className="text-lg sm:text-xl font-semibold mt-6 sm:mt-8 mb-3">{paragraph.replace(/\*\*/g, "")}</h3>;
            }
            if (paragraph.startsWith("- ")) {
              return (
                <ul key={i} className="my-4 list-disc pl-6 space-y-1">
                  {paragraph.split("\n").map((line, j) => (
                    <li key={j} className="text-muted-foreground leading-relaxed">{line.replace("- ", "")}</li>
                  ))}
                </ul>
              );
            }
            return <p key={i} className="text-muted-foreground leading-relaxed mb-4">{paragraph}</p>;
          })}
        </article>

        {guide.relatedPackageSlugs && guide.relatedPackageSlugs.length > 0 && (
          <div className="mt-10 sm:mt-12">
            <h2 className="text-lg sm:text-xl font-semibold mb-4">Related Detox</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {guide.relatedPackageSlugs.map((s) => <RelatedPackageCard key={s} slug={s} />)}
            </div>
          </div>
        )}

        {related.length > 0 && (
          <div className="mt-10 sm:mt-12">
            <h2 className="text-lg sm:text-xl font-semibold mb-4">More Guides</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {related.map((g) => <RelatedGuideCard key={g.id} slug={g.slug} />)}
            </div>
          </div>
        )}

        <GuideCTA />
      </div>
    </section>
  );
}
