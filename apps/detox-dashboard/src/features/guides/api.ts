import type { GuideArticle } from "@urbandetox/utils";
import { getAllGuides } from "@urbandetox/utils";
import { Repository } from "@/lib/storage";

const STORAGE_KEY = "urbandetox-guides";

const repo = new Repository<GuideArticle>(STORAGE_KEY, getAllGuides());

export const guidesApi = {
  getAll: () => repo.getAll(),
  getById: (id: string) => repo.getById(id),
  getBySlug: (slug: string) => repo.getAll().find((g) => g.slug === slug),
  create: (guide: GuideArticle) => {
    if (repo.getAll().some((g) => g.slug === guide.slug)) {
      throw new Error("A guide with this slug already exists");
    }
    repo.create(guide);
  },
  update: (id: string, updates: Partial<GuideArticle>) => {
    if (
      updates.slug &&
      repo.getAll().some((g) => g.id !== id && g.slug === updates.slug)
    ) {
      throw new Error("A guide with this slug already exists");
    }
    repo.update(id, updates);
  },
  delete: (id: string) => repo.delete(id),
} as const;

export type { GuideArticle };
