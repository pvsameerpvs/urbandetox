import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface PageHeaderProps {
  backHref: string;
  backLabel: string;
  title: string;
  subtitle: string;
}

export function PageHeader({ backHref, backLabel, title, subtitle }: PageHeaderProps) {
  return (
    <>
      <Link href={backHref} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
        <ArrowLeft className="h-4 w-4" /> {backLabel}
      </Link>
      <h1 className="text-2xl font-bold tracking-tight mb-1">{title}</h1>
      <p className="text-sm text-muted-foreground mb-6">{subtitle}</p>
    </>
  );
}
