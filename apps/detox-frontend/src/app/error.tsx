"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@urbandetox/ui";
import { RefreshCw, MessageCircle, Home } from "lucide-react";
import { whatsappLink } from "@urbandetox/utils";

/**
 * Without this file any thrown error rendered Next's bare
 * "Application error: a server-side exception has occurred" screen: no
 * navigation, no logo, no way to reach us. A single failing API call was enough
 * to produce it, because most page fetches were unguarded.
 */
export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // The digest is the only handle on the server-side stack, so keep it.
    console.error("[App error]", error.digest ?? "", error.message);
  }, [error]);

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-5 py-16 text-center">
      <h1 className="mb-2 text-2xl font-bold tracking-tight">That did not load</h1>
      <p className="mb-7 text-sm text-muted-foreground">
        Something broke on our side, not yours. Trying again usually works. If it
        does not, message us and we will sort it out.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button
          onClick={reset}
          className="h-11 rounded-xl bg-brand px-5 text-sm font-semibold text-brand-foreground hover:bg-brand/90"
        >
          <RefreshCw className="mr-2 h-4 w-4" /> Try again
        </Button>
        <Button asChild variant="outline" className="h-11 rounded-xl px-5 text-sm font-semibold">
          <Link href="/">
            <Home className="mr-2 h-4 w-4" /> Go home
          </Link>
        </Button>
        <Button asChild variant="ghost" className="h-11 rounded-xl px-4 text-sm font-semibold">
          <a href={whatsappLink("Hi, the Urban Detox site hit an error.")} target="_blank" rel="noopener noreferrer">
            <MessageCircle className="mr-2 h-4 w-4" /> WhatsApp us
          </a>
        </Button>
      </div>

      {error.digest && (
        <p className="mt-6 text-[11px] text-muted-foreground/70">
          Reference: {error.digest}
        </p>
      )}
    </div>
  );
}
