import { ShieldCheck } from "lucide-react";

interface TermsHeroProps {
  lastUpdated: string;
}

export function TermsHero({ lastUpdated }: TermsHeroProps) {
  return (
    <div className="relative bg-sidebar-dark overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 sm:py-20 text-center">
        {/* On sidebar-dark, `text-brand` (#2d4f3c) only reaches 1.98:1 contrast.
            Dark heroes across the site use white at reduced opacity instead. */}
        <div className="inline-flex items-center gap-3 mb-5">
          <div className="h-px w-10 bg-white/40" />
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-white/70">Legal</span>
          <div className="h-px w-10 bg-white/40" />
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
          Terms &amp; Conditions
        </h1>
        <p className="text-base text-white/60 max-w-xl mx-auto">
          Booking, payment, privacy, cancellation, and refund policies for every Urban Detox trip.
        </p>
        <div className="mt-7 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-medium text-white/70">
          <ShieldCheck className="h-3.5 w-3.5" />
          Last updated on {lastUpdated}
        </div>
      </div>
    </div>
  );
}
