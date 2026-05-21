import { Request, Response } from "express";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { guides } from "@/db/schema";

export const GuideController = {
  async list(req: Request, res: Response) {
    const { featured, limit, category } = req.query;
    let result = await db.select().from(guides);
    if (category && typeof category === "string") {
      result = result.filter((g) => g.category === category);
    }
    if (featured === "true") {
      const l = limit && typeof limit === "string" ? parseInt(limit, 10) : 4;
      result = result.filter((g) => g.featured).slice(0, l);
    }
    res.json(result);
  },

  async getCategories(_req: Request, res: Response) {
    const all = await db.select().from(guides);
    res.json([...new Set(all.map((g) => g.category))]);
  },

  async getBySlug(req: Request, res: Response) {
    const slug = String(req.params.slug);
    const [guide] = await db
      .select()
      .from(guides)
      .where(eq(guides.slug, slug));
    if (!guide) {
      res.status(404).json({ error: "Guide not found" });
      return;
    }
    res.json(guide);
  },

  async getRelated(req: Request, res: Response) {
    const slug = String(req.params.slug);
    const l = req.query.limit && typeof req.query.limit === "string" ? parseInt(req.query.limit, 10) : 3;
    const [current] = await db
      .select()
      .from(guides)
      .where(eq(guides.slug, slug));
    if (!current) {
      res.json([]);
      return;
    }
    const all = await db.select().from(guides);
    const related = all
      .filter(
        (g) =>
          g.slug !== slug &&
          (g.destinationSlug === current.destinationSlug || g.category === current.category)
      )
      .slice(0, l);
    res.json(related);
  },
} as const;
