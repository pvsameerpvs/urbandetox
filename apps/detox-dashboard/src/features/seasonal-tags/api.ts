import type { SeasonalTag } from "@urbandetox/utils";
import { initialSeasonalTags } from "@urbandetox/utils";
import { Repository } from "@/lib/storage";

const TAGS_KEY = "ud-admin-seasonal-tags";

const repo = new Repository<SeasonalTag>(TAGS_KEY, initialSeasonalTags);

export const seasonalTagsApi = {
  getAll: () => repo.getAll(),
  getById: (id: string) => repo.getById(id),
  create: (tag: SeasonalTag) => repo.create(tag),
  update: (id: string, data: Partial<SeasonalTag>) => repo.update(id, data),
  delete: (id: string) => repo.delete(id),
} as const;

export type { SeasonalTag };
