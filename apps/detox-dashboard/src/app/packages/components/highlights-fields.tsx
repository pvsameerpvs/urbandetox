import { Input } from "@urbandetox/ui";
import { Button } from "@urbandetox/ui";
import { Plus, X } from "lucide-react";

interface HighlightsFieldsProps {
  highlights: string[];
  onUpdate: (index: number, value: string) => void;
  onAdd: () => void;
  onRemove: (index: number) => void;
}

export function HighlightsFields({ highlights, onUpdate, onAdd, onRemove }: HighlightsFieldsProps) {
  return (
    <div className="space-y-3">
      {highlights.map((h, i) => (
        <div key={i} className="flex items-center gap-2">
          <Input value={h} onChange={(e) => onUpdate(i, e.target.value)} placeholder={`Highlight ${i + 1}`} className="h-10 rounded-xl" />
          <Button type="button" variant="ghost" size="icon" className="h-9 w-9 shrink-0" onClick={() => onRemove(i)}><X className="h-4 w-4" /></Button>
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" className="rounded-lg h-9 text-xs" onClick={onAdd}>
        <Plus className="h-3.5 w-3.5 mr-1" /> Add Highlight
      </Button>
    </div>
  );
}
