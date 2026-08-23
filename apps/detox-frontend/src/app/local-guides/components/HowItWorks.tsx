const STEPS = [
  {
    title: "You tell us the place",
    body: "Anywhere. It does not have to be somewhere we run trips, and it does not have to be in India.",
  },
  {
    title: "We find someone local",
    body: "Not an agency rep flown in for the day. Someone who lives there, speaks the language and knows which days things are shut.",
  },
  {
    title: "You talk to them directly",
    body: "We introduce you and share what they charge. You agree the plan with them, and we stay reachable if anything goes wrong.",
  },
];

/**
 * Written as three steps rather than a sales pitch because the honest version
 * is genuinely simple, and because nothing here promises a guide is available
 * for every location on any date.
 */
export function HowItWorks() {
  return (
    <section className="py-14 sm:py-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center gap-3">
          <span className="h-px w-8 bg-brand/60" />
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
            How it works
          </span>
        </div>
        <ol className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {STEPS.map((s, i) => (
            <li key={s.title}>
              <span className="mb-3 inline-flex h-8 w-8 items-center justify-center rounded-lg bg-brand/10 text-sm font-bold text-brand">
                {i + 1}
              </span>
              <h3 className="mb-1.5 text-sm font-bold">{s.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{s.body}</p>
            </li>
          ))}
        </ol>

        <p className="mt-8 rounded-xl bg-secondary/30 p-4 text-xs leading-relaxed text-muted-foreground">
          We are not able to guarantee a guide for every place on every date. If
          we cannot find someone good, we will tell you rather than send anyone.
        </p>
      </div>
    </section>
  );
}
