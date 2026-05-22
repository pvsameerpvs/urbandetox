import { Request, Response } from "express";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { seasonalTags } from "@/db/schema";

export const SeasonalTagController = {
  async list(_req: Request, res: Response) {
    const result = await db.select().from(seasonalTags);
    res.json(result);
  },

  async getById(req: Request, res: Response) {
    const id = String(req.params.id);
    const [tag] = await db
      .select()
      .from(seasonalTags)
      .where(eq(seasonalTags.id, id));
    if (!tag) {
      res.status(404).json({ error: "Seasonal tag not found" });
      return;
    }
    res.json(tag);
  },

  async create(req: Request, res: Response) {
    const [record] = await db.insert(seasonalTags).values(req.body).returning();
    res.status(201).json(record);
  },

  async update(req: Request, res: Response) {
    const id = String(req.params.id);
    const [record] = await db
      .update(seasonalTags)
      .set(req.body)
      .where(eq(seasonalTags.id, id))
      .returning();
    if (!record) {
      res.status(404).json({ error: "Seasonal tag not found" });
      return;
    }
    res.json(record);
  },

  async remove(req: Request, res: Response) {
    const id = String(req.params.id);
    const [record] = await db
      .delete(seasonalTags)
      .where(eq(seasonalTags.id, id))
      .returning();
    if (!record) {
      res.status(404).json({ error: "Seasonal tag not found" });
      return;
    }
    res.json({ success: true });
  },
} as const;
