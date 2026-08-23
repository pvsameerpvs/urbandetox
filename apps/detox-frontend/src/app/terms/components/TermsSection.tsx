import type { TermsSectionData } from "../terms-content";

interface TermsSectionProps {
  section: TermsSectionData;
  index: number;
}

export function TermsSection({ section, index }: TermsSectionProps) {
  const { id, title, body, list, bodyAfterList } = section;

  return (
    <section id={id} className="scroll-mt-28">
      <div className="flex items-baseline gap-3 mb-4">
        <span className="text-xs font-semibold tabular-nums text-brand">
          {String(index + 1).padStart(2, "0")}
        </span>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight">{title}</h2>
      </div>

      <div className="space-y-4 text-sm sm:text-base leading-relaxed text-muted-foreground">
        {body.map((p) => (
          <p key={p}>{p}</p>
        ))}

        {list && (
          <ul className="space-y-2 pl-1">
            {list.map((item) => (
              <li key={item} className="flex gap-3">
                <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        )}

        {bodyAfterList?.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </div>
    </section>
  );
}
