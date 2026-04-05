interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  description?: string;
}

export function SectionHeading({ eyebrow, title, description }: SectionHeadingProps) {
  return (
    <div className="space-y-3">
      <p className="text-xs uppercase tracking-[0.34em] text-[var(--brand-sand)]">{eyebrow}</p>
      <h2 className="font-display text-3xl text-white sm:text-4xl">{title}</h2>
      {description ? <p className="max-w-2xl text-sm leading-7 text-white/65 sm:text-base">{description}</p> : null}
    </div>
  );
}
