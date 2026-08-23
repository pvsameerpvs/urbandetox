interface TermsNavProps {
  sections: Array<{ id: string; title: string }>;
}

export function TermsNav({ sections }: TermsNavProps) {
  return (
    <nav aria-label="On this page" className="hidden lg:block">
      <div className="sticky top-28">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground mb-4">
          On This Page
        </p>
        <ul className="space-y-1 border-l border-border">
          {sections.map((s) => (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                className="block -ml-px border-l-2 border-transparent py-1.5 pl-4 text-sm text-muted-foreground transition-colors hover:border-brand hover:text-foreground focus-visible:border-brand focus-visible:text-foreground focus-visible:outline-none"
              >
                {s.title}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
