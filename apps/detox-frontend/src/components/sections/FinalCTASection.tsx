import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function FinalCTASection() {
  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-brand px-6 py-12 text-center sm:px-12 sm:py-16 lg:px-16">
          <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Ready for your next detox?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-white/80">
            Browse upcoming detoxes, pick your date, and step into something quieter.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Button
              size="lg"
              className="bg-white text-brand hover:bg-white/90"
              asChild
            >
              <Link href="/detox">
                Explore Upcoming Detox <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
