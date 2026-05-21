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
} as const;
