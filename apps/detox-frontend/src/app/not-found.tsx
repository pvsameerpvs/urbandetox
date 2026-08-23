import Link from "next/link";
import { Button } from "@urbandetox/ui";
import { Compass, Home } from "lucide-react";

export const metadata = {
  title: "Page not found | Urban Detox",
  robots: { index: false, follow: false },
};

/** Replaces Next's unstyled 404 so a wrong URL still offers a way onward. */
export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-5 py-16 text-center">
      <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
        404
      </p>
      <h1 className="mb-2 text-2xl font-bold tracking-tight">This page has moved on</h1>
      <p className="mb-7 text-sm text-muted-foreground">
        The link is wrong or the trip is no longer listed. The detoxes we are
        running now are all in one place.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button
          asChild
          className="h-11 rounded-xl bg-brand px-5 text-sm font-semibold text-brand-foreground hover:bg-brand/90"
        >
          <Link href="/detox">
            <Compass className="mr-2 h-4 w-4" /> See the trips
          </Link>
        </Button>
        <Button asChild variant="outline" className="h-11 rounded-xl px-5 text-sm font-semibold">
          <Link href="/">
            <Home className="mr-2 h-4 w-4" /> Go home
          </Link>
        </Button>
      </div>
    </div>
  );
}
