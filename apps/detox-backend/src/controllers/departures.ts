import { Request, Response } from "express";
import { eq, like } from "drizzle-orm";
import { db } from "@/db";
import { departures, destinations } from "@/db/schema";

async function generateDepartureCode(destinationSlug: string): Promise<string> {
  const [dest] = await db
    .select()
    .from(destinations)
    .where(eq(destinations.slug, destinationSlug));

  const prefix = (dest?.codePrefix ?? dest?.name ?? destinationSlug)
    .slice(0, 5)
    .toUpperCase();

  const existing = await db
    .select()
    .from(departures)
    .where(like(departures.code, `${prefix}-%`));

  let maxNum = 0;
  for (const dep of existing) {
    const match = dep.code.match(new RegExp(`^${prefix}-(\\d{3})$`));
    if (match) {
      maxNum = Math.max(maxNum, parseInt(match[1], 10));
    }
  }

  return `${prefix}-${String(maxNum + 1).padStart(3, "0")}`;
}

export const DepartureController = {
  async list(req: Request, res: Response) {
    const { package: pkgSlug, upcoming, limit } = req.query;
    let result = await db.select().from(departures);
    if (pkgSlug && typeof pkgSlug === "string") {
      result = result.filter((d) => d.packageSlug === pkgSlug);
    }
    if (upcoming === "true") {
      const l = limit && typeof limit === "string" ? parseInt(limit, 10) : 6;
      const today = new Date().toISOString().split("T")[0];
      result = result
        .filter((d) => d.startDate >= today && d.status !== "closed")
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

  async create(req: Request, res: Response) {
    const body = req.body;
    if (!body.code && body.destinationSlug) {
      body.code = await generateDepartureCode(body.destinationSlug);
    }
    const [record] = await db.insert(departures).values(body).returning();
    res.status(201).json(record);
  },

  async update(req: Request, res: Response) {
    const id = String(req.params.id);
    const [record] = await db
      .update(departures)
      .set(req.body)
      .where(eq(departures.id, id))
      .returning();
    if (!record) {
      res.status(404).json({ error: "Departure not found" });
      return;
    }
    res.json(record);
  },

  async remove(req: Request, res: Response) {
    const id = String(req.params.id);
    const [record] = await db
      .delete(departures)
      .where(eq(departures.id, id))
      .returning();
    if (!record) {
      res.status(404).json({ error: "Departure not found" });
      return;
    }
    res.json({ success: true });
  },
} as const;
