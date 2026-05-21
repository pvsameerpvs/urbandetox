import type { Departure } from "@urbandetox/utils";
import { departures as initialDepartures } from "@/data/departures";
import { Repository } from "@/lib/storage";

const DEP_KEY = "ud-admin-departures";

const repo = new Repository<Departure>(DEP_KEY, initialDepartures);

export const departuresApi = {
  getAll: () => repo.getAll(),
  getByCode: (code: string) => repo.getAll().find((d) => d.code === code),
  getByPackage: (packageSlug: string) =>
    repo.getAll().filter((d) => d.packageSlug === packageSlug),
  getUpcoming: (limit = 6) =>
    repo
      .getAll()
      .filter((d) => d.status !== "closed")
      .sort((a, b) => a.startDate.localeCompare(b.startDate))
      .slice(0, limit),
  getFillingFast: () =>
    repo
      .getAll()
      .filter((d) => d.status !== "closed")
      .filter((d) => d.status === "filling" || d.seatsLeft <= 3)
      .sort((a, b) => a.startDate.localeCompare(b.startDate)),
  create: (dep: Departure) => repo.create(dep),
  update: (id: string, data: Partial<Departure>) => repo.update(id, data),
  delete: (id: string) => repo.delete(id),
  count: () => repo.count(),
} as const;

export type { Departure };
