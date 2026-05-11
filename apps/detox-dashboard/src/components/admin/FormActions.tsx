import { Button } from "@urbandetox/ui";
import Link from "next/link";

interface FormActionsProps {
  submitLabel: string;
  cancelHref: string;
}

export function FormActions({ submitLabel, cancelHref }: FormActionsProps) {
  return (
    <div className="flex items-center gap-3 pt-2">
      <Button type="submit" className="rounded-xl bg-brand text-brand-foreground hover:bg-brand/90 h-11 px-6 text-sm font-semibold shadow-lg shadow-brand/10">
        {submitLabel}
      </Button>
      <Button type="button" variant="outline" className="rounded-xl h-11 px-6 text-sm" asChild>
        <Link href={cancelHref}>Cancel</Link>
      </Button>
    </div>
  );
}
