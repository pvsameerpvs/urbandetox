import { Input } from "@urbandetox/ui";
import { Label } from "@urbandetox/ui";
import { SEASONAL_TAGS } from "@urbandetox/utils";
import { ImageUpload } from "@/components/admin/ImageUpload";

interface BasicInfoFieldsProps {
  form: {
    title: string;
    subtitle: string;
    destinationSlug: string;
    duration: number;
    startingPrice: number;
    groupSize: string;
    style: string;
    seasonalTag: string;
    coverImage: string;
  };
  setField: (field: "title" | "subtitle" | "destinationSlug" | "duration" | "startingPrice" | "groupSize" | "style" | "seasonalTag" | "coverImage", value: string | number) => void;
  destinations: { slug: string; name: string }[];
}

export function BasicInfoFields({ form, setField, destinations }: BasicInfoFieldsProps) {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="space-y-2">
          <Label>Title</Label>
          <Input value={form.title} onChange={(e) => setField("title", e.target.value)} placeholder="e.g. Kashmir 3-Day Detox" className="h-11 rounded-xl" required />
        </div>
        <div className="space-y-2">
          <Label>Destination</Label>
          <select value={form.destinationSlug} onChange={(e) => setField("destinationSlug", e.target.value)} className="h-11 w-full rounded-xl border border-border/60 bg-white px-3 text-sm">
            {destinations.map((d) => (<option key={d.slug} value={d.slug}>{d.name}</option>))}
          </select>
        </div>
      </div>
      <div className="space-y-2">
        <Label>Subtitle</Label>
        <Input value={form.subtitle} onChange={(e) => setField("subtitle", e.target.value)} placeholder="Short description..." className="h-11 rounded-xl" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="space-y-2">
          <Label>Duration (days)</Label>
          <Input type="number" value={form.duration} onChange={(e) => setField("duration", parseInt(e.target.value) || 1)} className="h-11 rounded-xl" min={1} />
        </div>
        <div className="space-y-2">
          <Label>Starting Price (Rs)</Label>
          <Input type="number" value={form.startingPrice} onChange={(e) => setField("startingPrice", parseInt(e.target.value) || 0)} className="h-11 rounded-xl" min={0} />
        </div>
        <div className="space-y-2">
          <Label>Group Size</Label>
          <Input value={form.groupSize} onChange={(e) => setField("groupSize", e.target.value)} placeholder="6 to 12" className="h-11 rounded-xl" />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="space-y-2">
          <Label>Style</Label>
          <Input value={form.style} onChange={(e) => setField("style", e.target.value)} placeholder="e.g. Lake-led + slow" className="h-11 rounded-xl" />
        </div>
        <div className="space-y-2">
          <Label>Seasonal Tag</Label>
          <select value={form.seasonalTag} onChange={(e) => setField("seasonalTag", e.target.value)} className="h-11 w-full rounded-xl border border-border/60 bg-white px-3 text-sm">
            {SEASONAL_TAGS.map((t) => (<option key={t} value={t}>{t}</option>))}
          </select>
        </div>
      </div>
      <ImageUpload value={form.coverImage} onChange={(v) => setField("coverImage", v)} label="Cover Image" />
    </div>
  );
}
