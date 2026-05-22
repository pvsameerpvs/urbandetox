import { Request, Response } from "express";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { destinations } from "@/db/schema";

export const DestinationController = {
  async list(_req: Request, res: Response) {
    const result = await db.select().from(destinations);
    res.json(result);
  },

  async getBySlug(req: Request, res: Response) {
    const slug = String(req.params.slug);
    const [dest] = await db
      .select()
      .from(destinations)
      .where(eq(destinations.slug, slug));
    if (!dest) {
      res.status(404).json({ error: "Destination not found" });
      return;
    }
    res.json(dest);
  },

  async create(req: Request, res: Response) {
    const [record] = await db.insert(destinations).values(req.body).returning();
    res.status(201).json(record);
  },

  async update(req: Request, res: Response) {
    const slug = String(req.params.slug);
    const [record] = await db
      .update(destinations)
      .set(req.body)
      .where(eq(destinations.slug, slug))
      .returning();
    if (!record) {
      res.status(404).json({ error: "Destination not found" });
      return;
    }
    res.json(record);
  },

  async remove(req: Request, res: Response) {
    const slug = String(req.params.slug);
    const [record] = await db
      .delete(destinations)
      .where(eq(destinations.slug, slug))
      .returning();
    if (!record) {
      res.status(404).json({ error: "Destination not found" });
      return;
    }
    res.json({ success: true });
  },
} as const;
