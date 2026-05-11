import { useState } from "react";
import { SEASONAL_TAGS } from "@urbandetox/utils";
import type { ItineraryDay } from "@urbandetox/utils";

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
  itinerary: ItineraryDay[];
  included: string[];
  notIncluded: string[];
  gallery: string[];
  faqs: { question: string; answer: string }[];
}

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
    itinerary: initialData?.itinerary?.length ? initialData.itinerary : [{ day: 1, title: "", description: "", activities: [""], stay: "", meals: "", image: "", travelNotes: "" }],
    included: initialData?.included?.length ? initialData.included : [""],
    notIncluded: initialData?.notIncluded?.length ? initialData.notIncluded : [""],
    gallery: initialData?.gallery?.length ? initialData.gallery : [],
    faqs: initialData?.faqs?.length ? initialData.faqs : [{ question: "", answer: "" }],
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

  const updateIncluded = (index: number, value: string) => {
    setForm((prev) => {
      const arr = [...prev.included];
      arr[index] = value;
      return { ...prev, included: arr };
    });
  };
  const addIncluded = () => setForm((prev) => ({ ...prev, included: [...prev.included, ""] }));
  const removeIncluded = (index: number) => setForm((prev) => ({ ...prev, included: prev.included.filter((_, i) => i !== index) }));

  const updateNotIncluded = (index: number, value: string) => {
    setForm((prev) => {
      const arr = [...prev.notIncluded];
      arr[index] = value;
      return { ...prev, notIncluded: arr };
    });
  };
  const addNotIncluded = () => setForm((prev) => ({ ...prev, notIncluded: [...prev.notIncluded, ""] }));
  const removeNotIncluded = (index: number) => setForm((prev) => ({ ...prev, notIncluded: prev.notIncluded.filter((_, i) => i !== index) }));

  const updateFaq = (index: number, field: "question" | "answer", value: string) => {
    setForm((prev) => {
      const faqs = [...prev.faqs];
      faqs[index] = { ...faqs[index], [field]: value };
      return { ...prev, faqs };
    });
  };
  const addFaq = () => setForm((prev) => ({ ...prev, faqs: [...prev.faqs, { question: "", answer: "" }] }));
  const removeFaq = (index: number) => setForm((prev) => ({ ...prev, faqs: prev.faqs.filter((_, i) => i !== index) }));

  const addGallery = (value?: string) => setForm((prev) => ({ ...prev, gallery: [...prev.gallery, value || ""] }));
  const removeGallery = (index: number) => setForm((prev) => ({ ...prev, gallery: prev.gallery.filter((_, i) => i !== index) }));

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
      return { ...prev, itinerary: [...prev.itinerary, { day: nextDay, title: "", description: "", activities: [""], stay: "", meals: "", image: "", travelNotes: "" }] };
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
    updateHighlight, addHighlight, removeHighlight,
    updateIncluded, addIncluded, removeIncluded,
    updateNotIncluded, addNotIncluded, removeNotIncluded,
    updateFaq, addFaq, removeFaq,
    addGallery, removeGallery,
    updateItineraryDay,
    updateActivity, addActivity,
    addDay, removeDay,
  };
}
