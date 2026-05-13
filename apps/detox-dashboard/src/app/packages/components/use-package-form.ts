import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAdminSeasonalTags } from "@/hooks/use-admin-data";
import { initialSeasonalTags } from "@urbandetox/utils";

const itineraryDaySchema = z.object({
  day: z.number(),
  title: z.string().min(1, "Day title is required"),
  description: z.string().min(1, "Description is required"),
  activities: z.array(z.string()),
  stay: z.string(),
  meals: z.string(),
  image: z.string(),
  travelNotes: z.string(),
});

export const packageSchema = z.object({
  title: z.string().min(1, "Title is required"),
  subtitle: z.string().min(1, "Subtitle is required"),
  destinationSlug: z.string().min(1, "Destination is required"),
  duration: z.number().min(1, "Duration must be at least 1 day"),
  startingPrice: z.number().min(0, "Price must be 0 or more"),
  groupSize: z.string().min(1, "Group size is required"),
  style: z.string().min(1, "Style is required"),
  seasonalTag: z.string().min(1, "Seasonal tag is required"),
  coverImage: z.string().min(1, "Cover image is required"),
  highlights: z.array(z.string()).min(1, "At least one highlight is required"),
  included: z.array(z.string()),
  notIncluded: z.array(z.string()),
  gallery: z.array(z.string()),
  faqs: z.array(z.object({ question: z.string(), answer: z.string() })),
  itinerary: z.array(itineraryDaySchema).min(1, "At least one day is required"),
});

export type PackageFormData = z.infer<typeof packageSchema>;

interface InitialData {
  title?: string;
  subtitle?: string;
  destinationSlug?: string;
  duration?: number;
  startingPrice?: number;
  groupSize?: string;
  style?: string;
  seasonalTag?: string;
  coverImage?: string;
  highlights?: string[];
  included?: string[];
  notIncluded?: string[];
  gallery?: string[];
  faqs?: { question: string; answer: string }[];
  itinerary?: { day: number; title: string; description: string; activities: string[]; stay?: string; meals?: string; image?: string; travelNotes?: string }[];
}

export function usePackageForm(initialDestinationSlug: string, initialData?: InitialData) {
  const tags = useAdminSeasonalTags();
  const firstTag = tags[0]?.name || initialSeasonalTags[0]?.name || "";

  const defaultValues: PackageFormData = {
    title: initialData?.title || "",
    subtitle: initialData?.subtitle || "",
    destinationSlug: initialData?.destinationSlug || initialDestinationSlug,
    duration: initialData?.duration || 2,
    startingPrice: initialData?.startingPrice || 0,
    groupSize: initialData?.groupSize || "6 to 12",
    style: initialData?.style || "",
    seasonalTag: initialData?.seasonalTag || firstTag,
    coverImage: initialData?.coverImage || "",
    highlights: initialData?.highlights?.length ? initialData.highlights : [""],
    included: initialData?.included?.length ? initialData.included : [""],
    notIncluded: initialData?.notIncluded?.length ? initialData.notIncluded : [""],
    gallery: initialData?.gallery || [],
    faqs: initialData?.faqs?.length ? initialData.faqs : [{ question: "", answer: "" }],
    itinerary: initialData?.itinerary?.length
      ? initialData.itinerary.map((d) => ({
          day: d.day,
          title: d.title,
          description: d.description,
          activities: d.activities || [""],
          stay: d.stay || "",
          meals: d.meals || "",
          image: d.image || "",
          travelNotes: d.travelNotes || "",
        }))
      : [{ day: 1, title: "", description: "", activities: [""], stay: "", meals: "", image: "", travelNotes: "" }],
  };

  const form = useForm<PackageFormData>({
    resolver: zodResolver(packageSchema),
    defaultValues,
  });

  /* eslint-disable react-hooks/incompatible-library */
  const highlights = form.watch("highlights");
  const included = form.watch("included");
  const notIncluded = form.watch("notIncluded");
  const gallery = form.watch("gallery");
  const faqs = form.watch("faqs");
  const itinerary = form.watch("itinerary");
  /* eslint-enable react-hooks/incompatible-library */

  const updateArrayItem = (name: "highlights" | "included" | "notIncluded" | "gallery", index: number, value: string) => {
    const arr = [...form.getValues(name)];
    arr[index] = value;
    form.setValue(name, arr, { shouldValidate: true });
  };

  const appendArrayItem = (name: "highlights" | "included" | "notIncluded" | "gallery", value: string) => {
    form.setValue(name, [...form.getValues(name), value], { shouldValidate: true });
  };

  const removeArrayItem = (name: "highlights" | "included" | "notIncluded" | "gallery", index: number) => {
    form.setValue(name, form.getValues(name).filter((_, i) => i !== index), { shouldValidate: true });
  };

  const updateFaq = (index: number, field: "question" | "answer", value: string) => {
    const arr = [...form.getValues("faqs")];
    arr[index] = { ...arr[index], [field]: value };
    form.setValue("faqs", arr, { shouldValidate: true });
  };

  const appendFaq = () => {
    form.setValue("faqs", [...form.getValues("faqs"), { question: "", answer: "" }], { shouldValidate: true });
  };

  const removeFaq = (index: number) => {
    form.setValue("faqs", form.getValues("faqs").filter((_, i) => i !== index), { shouldValidate: true });
  };

  const updateItineraryDay = (index: number, field: string, value: unknown) => {
    const arr = [...form.getValues("itinerary")];
    arr[index] = { ...arr[index], [field]: value };
    form.setValue("itinerary", arr, { shouldValidate: true });
  };

  const updateActivity = (dayIndex: number, actIndex: number, value: string) => {
    const arr = [...form.getValues("itinerary")];
    const acts = [...arr[dayIndex].activities];
    acts[actIndex] = value;
    arr[dayIndex] = { ...arr[dayIndex], activities: acts };
    form.setValue("itinerary", arr, { shouldValidate: true });
  };

  const addActivity = (dayIndex: number) => {
    const arr = [...form.getValues("itinerary")];
    arr[dayIndex] = { ...arr[dayIndex], activities: [...arr[dayIndex].activities, ""] };
    form.setValue("itinerary", arr, { shouldValidate: true });
  };

  const addDay = () => {
    const arr = [...form.getValues("itinerary")];
    const nextDay = arr.length + 1;
    form.setValue("itinerary", [...arr, { day: nextDay, title: "", description: "", activities: [""], stay: "", meals: "", image: "", travelNotes: "" }], { shouldValidate: true });
  };

  const removeDay = (index: number) => {
    const arr = form.getValues("itinerary");
    if (arr.length <= 1) return;
    const filtered = arr.filter((_, i) => i !== index).map((d, i) => ({ ...d, day: i + 1 }));
    form.setValue("itinerary", filtered, { shouldValidate: true });
  };

  return {
    form,
    highlights,
    included,
    notIncluded,
    gallery,
    faqs,
    itinerary,
    updateArrayItem,
    appendArrayItem,
    removeArrayItem,
    updateFaq,
    appendFaq,
    removeFaq,
    updateItineraryDay,
    updateActivity,
    addActivity,
    addDay,
    removeDay,
  };
}
