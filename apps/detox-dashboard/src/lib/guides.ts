"use client";

import { guidesApi } from "@/features/guides";
import type { GuideArticle } from "@urbandetox/utils";

export function getAdminGuides(): GuideArticle[] {
  return guidesApi.getAll();
}

export function getAdminGuideById(id: string): GuideArticle | undefined {
  return guidesApi.getById(id);
}

export function createGuide(guide: GuideArticle) {
  guidesApi.create(guide);
}

export function updateGuide(id: string, updates: Partial<GuideArticle>) {
  guidesApi.update(id, updates);
}

export function deleteGuide(id: string) {
  guidesApi.delete(id);
}
