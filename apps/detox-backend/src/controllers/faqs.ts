import { Request, Response } from "express";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { faqs } from "@/db/schema";

export const FaqController = {
  async list(req: Request, res: Response) {
    const { category } = req.query;
    if (category && typeof category === "string") {
      const result = await db
        .select()
        .from(faqs)
        .where(eq(faqs.category, category));
      res.json(result);
    } else {
      const result = await db.select().from(faqs);
      res.json(result);
    }
  },

  async getCategories(_req: Request, res: Response) {
    const all = await db.select().from(faqs);
    res.json([...new Set(all.map((f) => f.category))]);
  },

  async create(req: Request, res: Response) {
    const [record] = await db.insert(faqs).values(req.body).returning();
    res.status(201).json(record);
  },

  async update(req: Request, res: Response) {
    const id = String(req.params.id);
    const [record] = await db
      .update(faqs)
      .set(req.body)
      .where(eq(faqs.id, id))
      .returning();
    if (!record) {
      res.status(404).json({ error: "FAQ not found" });
      return;
    }
    res.json(record);
  },

  async remove(req: Request, res: Response) {
    const id = String(req.params.id);
    const [record] = await db
      .delete(faqs)
      .where(eq(faqs.id, id))
      .returning();
    if (!record) {
      res.status(404).json({ error: "FAQ not found" });
      return;
    }
    res.json({ success: true });
  },
} as const;
