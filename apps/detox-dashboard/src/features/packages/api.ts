import type { Package } from "@urbandetox/utils";
import { packages as initialPackages } from "@/data/packages";
import { Repository } from "@/lib/storage";

const PKG_KEY = "ud-admin-packages";

const repo = new Repository<Package>(PKG_KEY, initialPackages);

export const packagesApi = {
  getAll: () => repo.getAll(),
  getBySlug: (slug: string) => repo.getAll().find((p) => p.slug === slug),
  getById: (id: string) => repo.getById(id),
  getByDestination: (destinationSlug: string) =>
    repo.getAll().filter((p) => p.destinationSlug === destinationSlug),
  create: (pkg: Package) => repo.create(pkg),
  update: (id: string, data: Partial<Package>) => repo.update(id, data),
  updateBySlug: (slug: string, data: Partial<Package>) => {
    const item = repo.getAll().find((p) => p.slug === slug);
    if (item) repo.update(item.id, data);
  },
  delete: (id: string) => repo.delete(id),
  deleteBySlug: (slug: string) => {
    const item = repo.getAll().find((p) => p.slug === slug);
    if (item) repo.delete(item.id);
  },
  count: () => repo.count(),
  countByTag: (tagName: string) => repo.count((p) => p.seasonalTag === tagName),
} as const;

export type { Package };
