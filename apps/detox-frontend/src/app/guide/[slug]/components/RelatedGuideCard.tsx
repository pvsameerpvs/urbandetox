
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { fetchGuideBySlug } from "@/lib/data";

interface GuideLinkProps {
  slug: string;
}

export function RelatedGuideCard({ slug }: GuideLinkProps) {
  const g = fetchGuideBySlug(slug);
  if (!g) return null;

  return (
    <Link href={`/guide/${g.slug}`} className="group block">
      <Card className="overflow-hidden border-border/60 bg-card h-full">
        <div className="aspect-[16/10] overflow-hidden">
          <Image src={g.image} alt={g.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="(max-width: 640px) 100vw, 33vw" />
        </div>
        <CardContent className="p-4">
          <p className="text-xs text-brand mb-1">{g.category}</p>
          <p className="text-sm font-medium">{g.title}</p>
        </CardContent>
      </Card>
    </Link>
  );
}
