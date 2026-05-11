import { useState } from "react";

export interface PackageFormState {
  title: string;
  subtitle: string;
  destinationSlug: string;
  duration: number;
  startingPrice: number;
  groupSize: string;
  style: string;
  seasonalTag: string;
  coverImage: string;
  highlights: string[];
  itinerary: { day: number; title: string; description: string; activities: string[]; stay: string; meals: string }[];
}

const SEASONAL_TAGS = ["Summer Escape", "Monsoon Detox", "Coastal Detox", "Extended Detox"];

export function usePackageForm(initialDestinationSlug: string, initialData?: Partial<PackageFormState>) {
  const [form, setForm] = useState<PackageFormState>({
    title: initialData?.title || "",
    subtitle: initialData?.subtitle || "",
    destinationSlug: initialData?.destinationSlug || initialDestinationSlug,
    duration: initialData?.duration || 2,
    startingPrice: initialData?.startingPrice || 0,
    groupSize: initialData?.groupSize || "6 to 12",
    style: initialData?.style || "",
    seasonalTag: initialData?.seasonalTag || SEASONAL_TAGS[0],
    coverImage: initialData?.coverImage || "",
    highlights: initialData?.highlights?.length ? initialData.highlights : [""],
    itinerary: initialData?.itinerary?.length ? initialData.itinerary : [{ day: 1, title: "", description: "", activities: [""], stay: "", meals: "" }],
  });

  const setField = <K extends keyof PackageFormState>(field: K, value: PackageFormState[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const updateHighlight = (index: number, value: string) => {
    setForm((prev) => {
      const h = [...prev.highlights];
      h[index] = value;
      return { ...prev, highlights: h };
    });
  };

  const addHighlight = () => setForm((prev) => ({ ...prev, highlights: [...prev.highlights, ""] }));
  const removeHighlight = (index: number) => setForm((prev) => ({ ...prev, highlights: prev.highlights.filter((_, i) => i !== index) }));

  const updateItineraryDay = (index: number, field: string, value: unknown) => {
    setForm((prev) => {
      const it = [...prev.itinerary];
      it[index] = { ...it[index], [field]: value };
      return { ...prev, itinerary: it };
    });
  };

  const updateActivity = (dayIndex: number, actIndex: number, value: string) => {
    setForm((prev) => {
      const it = [...prev.itinerary];
      const acts = [...it[dayIndex].activities];
      acts[actIndex] = value;
      it[dayIndex] = { ...it[dayIndex], activities: acts };
      return { ...prev, itinerary: it };
    });
  };

  const addActivity = (dayIndex: number) => {
    setForm((prev) => {
      const it = [...prev.itinerary];
      it[dayIndex] = { ...it[dayIndex], activities: [...it[dayIndex].activities, ""] };
      return { ...prev, itinerary: it };
    });
  };

  const addDay = () => {
    setForm((prev) => {
      const nextDay = prev.itinerary.length + 1;
      return { ...prev, itinerary: [...prev.itinerary, { day: nextDay, title: "", description: "", activities: [""], stay: "", meals: "" }] };
    });
  };

  const removeDay = (index: number) => {
    setForm((prev) => {
      if (prev.itinerary.length <= 1) return prev;
      const filtered = prev.itinerary.filter((_, i) => i !== index).map((d, i) => ({ ...d, day: i + 1 }));
      return { ...prev, itinerary: filtered };
    });
  };

  return {
    form,
    setField,
    updateHighlight,
    addHighlight,
    removeHighlight,
    updateItineraryDay,
    updateActivity,
    addActivity,
    addDay,
    removeDay,
  };
}
