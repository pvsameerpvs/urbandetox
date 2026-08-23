import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAdminSeasonalTags } from "@/hooks/use-admin-data";
import { initialSeasonalTags } from "@urbandetox/utils";
import { useEffect, useMemo } from "react";

const itineraryDaySchema = z.object({
  day: z.number(),
  title: z.string().min(1, "Day title is required"),
  description: z.string().min(1, "Description is required"),
  activities: z.array(z.string()),
  image: z.string(),
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
  itineraryPdf: z.string().optional(),

  // taxonomy and logistics (all optional so existing flows keep working)
  audiences: z.array(z.string()),
  themes: z.array(z.string()),
  terrains: z.array(z.string()),
  fitnessLevel: z.string(),
  isDomestic: z.boolean(),
  isWeekend: z.boolean(),
  womenFriendly: z.boolean(),
  soloFriendly: z.boolean(),
  status: z.string(),
  pickupPoint: z.string(),
  dropPoint: z.string(),
  pickupTime: z.string(),
  returnTime: z.string(),
  pickupMapImage: z.string(),
  pickupMapUrl: z.string(),
  transportType: z.string(),
  stayType: z.string(),
  roomSharing: z.string(),
  mealPlan: z.string(),
  cancellationPolicy: z.string(),
  whatToPack: z.array(z.string()),
  thingsToKnow: z.array(z.string()),
  seoTitle: z.string(),
  seoDescription: z.string(),
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
  itinerary?: { day: number; title: string; description: string; activities: string[]; image?: string }[];
  itineraryPdf?: string;
  audiences?: string[] | null;
  themes?: string[] | null;
  terrains?: string[] | null;
  fitnessLevel?: string | null;
  isDomestic?: boolean;
  isWeekend?: boolean;
  womenFriendly?: boolean;
  soloFriendly?: boolean;
  status?: string;
  pickupPoint?: string | null;
  dropPoint?: string | null;
  pickupTime?: string | null;
  returnTime?: string | null;
  pickupMapImage?: string | null;
  pickupMapUrl?: string | null;
  transportType?: string | null;
  stayType?: string | null;
  roomSharing?: string | null;
  mealPlan?: string | null;
  cancellationPolicy?: string | null;
  whatToPack?: string[] | null;
  thingsToKnow?: string[] | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
}

export function usePackageForm(initialDestinationSlug: string, initialData?: InitialData) {
  const { data: tags } = useAdminSeasonalTags();
  const firstTag = tags[0]?.name || initialSeasonalTags[0]?.name || "";

  const defaultValues = useMemo<PackageFormData>(() => ({
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
    itineraryPdf: initialData?.itineraryPdf || "",
    itinerary: initialData?.itinerary?.length
      ? initialData.itinerary.map((d) => ({
          day: d.day,
          title: d.title,
          description: d.description,
          activities: d.activities || [""],
          image: d.image || "",
        }))
      : [{ day: 1, title: "", description: "", activities: [""], image: "" }],

    audiences: initialData?.audiences ?? [],
    themes: initialData?.themes ?? [],
    terrains: initialData?.terrains ?? [],
    fitnessLevel: initialData?.fitnessLevel ?? "",
    isDomestic: initialData?.isDomestic ?? true,
    isWeekend: initialData?.isWeekend ?? false,
    womenFriendly: initialData?.womenFriendly ?? true,
    soloFriendly: initialData?.soloFriendly ?? true,
    status: initialData?.status ?? "live",
    pickupPoint: initialData?.pickupPoint ?? "Bangalore",
    dropPoint: initialData?.dropPoint ?? "Bangalore",
    pickupTime: initialData?.pickupTime ?? "",
    returnTime: initialData?.returnTime ?? "",
    pickupMapImage: initialData?.pickupMapImage ?? "",
    pickupMapUrl: initialData?.pickupMapUrl ?? "",
    transportType: initialData?.transportType ?? "",
    stayType: initialData?.stayType ?? "",
    roomSharing: initialData?.roomSharing ?? "",
    mealPlan: initialData?.mealPlan ?? "",
    cancellationPolicy: initialData?.cancellationPolicy ?? "",
    whatToPack: initialData?.whatToPack ?? [],
    thingsToKnow: initialData?.thingsToKnow ?? [],
    seoTitle: initialData?.seoTitle ?? "",
    seoDescription: initialData?.seoDescription ?? "",
  }), [initialData, initialDestinationSlug, firstTag]);

  const form = useForm<PackageFormData>({
    resolver: zodResolver(packageSchema),
    defaultValues,
  });

  // Reset form when initialData changes (edit mode data load)
  useEffect(() => {
    if (initialData?.title) {
      form.reset(defaultValues);
    }
  }, [initialData, form, defaultValues]);

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
    form.setValue("itinerary", [...arr, { day: nextDay, title: "", description: "", activities: [""], image: "" }], { shouldValidate: true });
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
