export default function ContactPage() {
  return (
    <div className="page-shell grid gap-8 py-16 pb-24 lg:grid-cols-[0.8fr_1.2fr]">
      <div className="spotlight-card space-y-4">
        <p className="pill">Contact</p>
        <h1 className="font-display text-4xl text-white">Need a custom trip, student batch, or retreat plan?</h1>
        <p className="text-sm leading-7 text-white/70">The admin and finance modules are already designed to support manual onboarding, group management, and follow-up operations.</p>
      </div>
      <form className="surface-card grid gap-4">
        <input placeholder="Name" />
        <input placeholder="Company or college" />
        <input placeholder="Email" type="email" />
        <textarea rows={6} placeholder="Tell us what you want to run" />
        <button className="rounded-full bg-[var(--brand-sand)] px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-white" type="button">Preview inquiry flow</button>
      </form>
    </div>
  );
}
