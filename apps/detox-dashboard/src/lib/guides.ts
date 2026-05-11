"use client";

import { getAllGuides, type GuideArticle } from "@urbandetox/utils";

const STORAGE_KEY = "urbandetox-guides";

function load(): GuideArticle[] {
  if (typeof window === "undefined") return getAllGuides();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getAllGuides();
    const parsed = JSON.parse(raw) as GuideArticle[];
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : getAllGuides();
  } catch {
    return getAllGuides();
  }
}

function save(data: GuideArticle[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function getAdminGuides(): GuideArticle[] {
  return load();
}

export function getAdminGuideById(id: string): GuideArticle | undefined {
  return load().find((g) => g.id === id);
}

export function createGuide(guide: GuideArticle) {
  const all = load();
  if (all.some((g) => g.slug === guide.slug)) {
    throw new Error("A guide with this slug already exists");
  }
  all.push(guide);
  save(all);
}

export function updateGuide(id: string, updates: Partial<GuideArticle>) {
  const all = load();
  const idx = all.findIndex((g) => g.id === id);
  if (idx === -1) throw new Error("Guide not found");
  if (updates.slug && all.some((g) => g.id !== id && g.slug === updates.slug)) {
    throw new Error("A guide with this slug already exists");
  }
  all[idx] = { ...all[idx], ...updates };
  save(all);
}

export function deleteGuide(id: string) {
  const all = load().filter((g) => g.id !== id);
  save(all);
}
