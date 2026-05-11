import { Input, Button, Textarea } from "@urbandetox/ui";
import { Plus, X } from "lucide-react";

interface FaqField {
  question: string;
  answer: string;
}

interface FaqsFieldsProps {
  faqs: FaqField[];
  onUpdate: (index: number, field: "question" | "answer", value: string) => void;
  onAdd: () => void;
  onRemove: (index: number) => void;
}

export function FaqsFields({ faqs, onUpdate, onAdd, onRemove }: FaqsFieldsProps) {
  return (
    <div className="space-y-4">
      {faqs.map((faq, i) => (
        <div key={i} className="rounded-xl border border-border/40 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-brand">FAQ {i + 1}</span>
            <Button type="button" variant="ghost" size="icon" className="h-7 w-7 text-red-500" onClick={() => onRemove(i)}><X className="h-3.5 w-3.5" /></Button>
          </div>
          <Input value={faq.question} onChange={(e) => onUpdate(i, "question", e.target.value)} placeholder="Question" className="h-10 rounded-xl" />
          <Textarea value={faq.answer} onChange={(e) => onUpdate(i, "answer", e.target.value)} placeholder="Answer" className="rounded-xl min-h-[60px]" />
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" className="rounded-lg h-9 text-xs" onClick={onAdd}>
        <Plus className="h-3.5 w-3.5 mr-1" /> Add FAQ
      </Button>
    </div>
  );
}
