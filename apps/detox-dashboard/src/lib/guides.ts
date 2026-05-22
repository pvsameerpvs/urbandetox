import { fetchGuides } from "@/lib/api";
import type { GuideArticle } from "@urbandetox/utils";

export async function getAdminGuides(): Promise<GuideArticle[]> {
  return fetchGuides<GuideArticle>();
}

export async function getAdminGuideById(id: string): Promise<GuideArticle | undefined> {
  try {
    const all = await getAdminGuides();
    return all.find((g) => g.id === id);
  } catch {
    return undefined;
  }
}

export async function createGuide(guide: GuideArticle): Promise<void> {
  // await apiCreateGuide(guide);
  throw new Error("Not implemented: createGuide via API");
}

export async function updateGuide(id: string, updates: Partial<GuideArticle>): Promise<void> {
  // await apiUpdateGuide(id, updates);
  throw new Error("Not implemented: updateGuide via API");
}

export async function deleteGuide(id: string): Promise<void> {
  // await apiDeleteGuide(id);
  throw new Error("Not implemented: deleteGuide via API");
}
