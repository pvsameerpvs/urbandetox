import type { Metadata } from "next";
import { TermsHero } from "./components/TermsHero";
import { TermsNav } from "./components/TermsNav";
import { TermsSection } from "./components/TermsSection";
import { TermsContactCard } from "./components/TermsContactCard";
import { INTRO, LAST_UPDATED, TERMS_SECTIONS } from "./terms-content";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description:
    "Read booking, payment, cancellation, privacy, safety, and refund policies for Urban Detox trips.",
  alternates: { canonical: "https://www.urbandetox.in/terms" },
};

const NAV_ITEMS = [
  ...TERMS_SECTIONS.map(({ id, title }) => ({ id, title })),
  { id: "contact-information", title: "Contact Information" },
];

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <TermsHero lastUpdated={LAST_UPDATED} />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-10 lg:gap-16">
          <TermsNav sections={NAV_ITEMS} />

          <div className="min-w-0 max-w-3xl">
            <div className="space-y-4 text-sm sm:text-base leading-relaxed text-muted-foreground pb-10 mb-4 border-b border-border">
              {INTRO.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>

            <div className="space-y-12">
              {TERMS_SECTIONS.map((section, i) => (
                <TermsSection key={section.id} section={section} index={i} />
              ))}
              <TermsContactCard index={TERMS_SECTIONS.length} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
