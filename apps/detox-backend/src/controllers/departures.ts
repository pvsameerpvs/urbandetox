import { Request, Response } from "express";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { departures } from "@/db/schema";

export const DepartureController = {
  async list(req: Request, res: Response) {
    const { package: pkgSlug, upcoming, limit } = req.query;
    let result = await db.select().from(departures);
    if (pkgSlug && typeof pkgSlug === "string") {
      result = result.filter((d) => d.packageSlug === pkgSlug);
    }
    if (upcoming === "true") {
      const l = limit && typeof limit === "string" ? parseInt(limit, 10) : 6;
      result = result
        .filter((d) => d.status !== "closed")
        .sort((a, b) => a.startDate.localeCompare(b.startDate))
        .slice(0, l);
    }
    res.json(result);
  },

  async getByCode(req: Request, res: Response) {
    const code = String(req.params.code);
    const [dep] = await db
      .select()
      .from(departures)
      .where(eq(departures.code, code));
    if (!dep) {
      res.status(404).json({ error: "Departure not found" });
      return;
    }
    res.json(dep);
  },
} as const;
