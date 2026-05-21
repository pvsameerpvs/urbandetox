import type { Destination } from "@urbandetox/utils";
import { destinations as initialDestinations } from "@/data/destinations";
import { Repository } from "@/lib/storage";

const DEST_KEY = "ud-admin-destinations";

const repo = new Repository<Destination>(DEST_KEY, initialDestinations);

export const destinationsApi = {
  getAll: () => repo.getAll(),
  getBySlug: (slug: string) => repo.getAll().find((d) => d.slug === slug),
  getById: (id: string) => repo.getById(id),
  create: (dest: Destination) => repo.create(dest),
  update: (id: string, data: Partial<Destination>) => repo.update(id, data),
  updateBySlug: (slug: string, data: Partial<Destination>) => {
    const item = repo.getAll().find((d) => d.slug === slug);
    if (item) repo.update(item.id, data);
  },
  delete: (id: string) => repo.delete(id),
  deleteBySlug: (slug: string) => {
    const item = repo.getAll().find((d) => d.slug === slug);
    if (item) repo.delete(item.id);
  },
  count: () => repo.count(),
} as const;

export type { Destination };
