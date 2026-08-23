"use client";

const LANGUAGES = ["English", "Hindi", "Kannada", "Malayalam", "Tamil", "Telugu"];

interface LanguagePickerProps {
  selected: string[];
  onToggle: (language: string) => void;
}

export function LanguagePicker({ selected, onToggle }: LanguagePickerProps) {
  return (
    <fieldset className="space-y-2">
      <legend className="text-xs font-semibold">Languages you would prefer</legend>
      <div className="flex flex-wrap gap-2">
        {LANGUAGES.map((l) => {
          const on = selected.includes(l);
          return (
            <button
              type="button"
              key={l}
              aria-pressed={on}
              onClick={() => onToggle(l)}
              className={`rounded-full border px-3.5 py-2 text-xs font-medium transition-colors ${
                on
                  ? "border-brand bg-brand text-brand-foreground"
                  : "border-border bg-card text-muted-foreground hover:border-brand/40 hover:text-foreground"
              }`}
            >
              {l}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
