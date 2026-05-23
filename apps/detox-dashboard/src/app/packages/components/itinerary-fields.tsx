import { Input, Button, Textarea } from "@urbandetox/ui";
import type { ItineraryDay } from "@urbandetox/utils";
import { ImageUploadInline } from "@/components/shared/ImageUploadInline";
import { Plus } from "lucide-react";

interface ItineraryFieldsProps {
  itinerary: ItineraryDay[];
  onUpdateDay: (index: number, field: string, value: unknown) => void;
  onUpdateActivity: (dayIndex: number, actIndex: number, value: string) => void;
  onAddActivity: (dayIndex: number) => void;
  onAddDay: () => void;
  onRemoveDay: (index: number) => void;
}

export function ItineraryFields({
  itinerary, onUpdateDay, onUpdateActivity, onAddActivity, onAddDay, onRemoveDay,
}: ItineraryFieldsProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Itinerary</h3>
        <Button type="button" variant="outline" size="sm" className="rounded-lg h-9 text-xs" onClick={onAddDay}>
          <Plus className="h-3.5 w-3.5 mr-1" /> Add Day
        </Button>
      </div>
      <div className="space-y-6">
        {itinerary.map((day, di) => (
          <div key={di} className="rounded-xl border border-border/40 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-brand">Day {day.day}</span>
              <Button type="button" variant="ghost" size="sm" className="h-7 text-xs text-red-500" onClick={() => onRemoveDay(di)}>Remove</Button>
            </div>
            <Input value={day.title} onChange={(e) => onUpdateDay(di, "title", e.target.value)} placeholder="Day title" className="h-10 rounded-xl" />
            <Textarea value={day.description} onChange={(e) => onUpdateDay(di, "description", e.target.value)} placeholder="Description" className="rounded-xl min-h-[60px]" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input value={day.stay ?? ""} onChange={(e) => onUpdateDay(di, "stay", e.target.value)} placeholder="Stay accommodation" className="h-10 rounded-xl" />
              <Input value={day.meals ?? ""} onChange={(e) => onUpdateDay(di, "meals", e.target.value)} placeholder="Meals" className="h-10 rounded-xl" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5"><p className="text-xs text-muted-foreground">Day image</p><ImageUploadInline value={day.image} onChange={(v) => onUpdateDay(di, "image", v)} folder="packages/itinerary" /></div>
              <Input value={day.travelNotes ?? ""} onChange={(e) => onUpdateDay(di, "travelNotes", e.target.value)} placeholder="Travel notes (optional)" className="h-10 rounded-xl" />
            </div>
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground">Activities</p>
              {day.activities.map((act, ai) => (
                <div key={ai} className="flex items-center gap-2">
                  <Input value={act} onChange={(e) => onUpdateActivity(di, ai, e.target.value)} placeholder={`Activity ${ai + 1}`} className="h-9 rounded-xl text-sm" />
                  {ai === day.activities.length - 1 && (
                    <Button type="button" variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={() => onAddActivity(di)}>
                      <Plus className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
