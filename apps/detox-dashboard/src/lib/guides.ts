import {
  fetchGuides,
  createGuide as apiCreateGuide,
  updateGuide as apiUpdateGuide,
  deleteGuide as apiDeleteGuide,
} from "@/lib/api";
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

export async function createGuide(guide: Omit<GuideArticle, "id">): Promise<void> {
  await apiCreateGuide(guide);
}

export async function updateGuide(id: string, updates: Partial<GuideArticle>): Promise<void> {
  await apiUpdateGuide(id, updates);
}

export async function deleteGuide(id: string): Promise<void> {
  await apiDeleteGuide(id);
}
