import type { Metadata } from "next";
import { fetchDestinations } from "@/lib/api";
import { JoinHero } from "./components/JoinHero";
import { GuideApplicationForm } from "./components/GuideApplicationForm";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Become a Guide | Work With Urban Detox",
  description:
    "Apply to guide Urban Detox trips. Tell us the destinations you know and the languages you speak.",
};

const EXPECTATIONS = [
  "You know one of our regions properly, not from a guidebook",
  "You speak the local language of that region",
  "You are comfortable leading a group of ten",
  "You are physically up to a moderate trek",
  "You can take decent photos and videos on a phone",
];

export default async function JoinUsPage() {
  const destinations = await fetchDestinations();

  return (
    <div className="min-h-screen bg-background">
      <JoinHero />

      <section className="py-12 sm:py-16">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_320px] lg:gap-16 lg:px-8">
          <div className="min-w-0">
            <h2 className="mb-6 text-2xl font-bold">Tell us about yourself</h2>
            <GuideApplicationForm destinations={destinations} />
          </div>

          <aside>
            <div className="rounded-2xl border-0 bg-white p-6 shadow-lg shadow-black/[0.03]">
              <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-muted-foreground">
                What we look for
              </h3>
              <ul className="space-y-3">
                {EXPECTATIONS.map((e) => (
                  <li key={e} className="flex gap-2.5 text-sm text-muted-foreground">
                    <span aria-hidden="true" className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
                    {e}
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
