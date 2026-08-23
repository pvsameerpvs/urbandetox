export function JoinHero() {
  return (
    <div className="relative overflow-hidden bg-sidebar-dark">
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />
      <div className="relative z-10 mx-auto max-w-7xl px-4 py-14 text-center sm:px-6 sm:py-20 lg:px-8">
        <div className="mb-5 inline-flex items-center gap-3">
          <div className="h-px w-10 bg-white/40" />
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-white/70">
            Work With Us
          </span>
          <div className="h-px w-10 bg-white/40" />
        </div>
        <h1 className="mb-4 text-3xl font-bold text-white sm:text-4xl md:text-5xl">
          Become an Urban Detox Guide
        </h1>
        <p className="mx-auto max-w-lg text-base text-white/60">
          We look for guides who know their region, speak the local language, and
          can hold a group of ten without it feeling like a tour.
        </p>
      </div>
    </div>
  );
}
