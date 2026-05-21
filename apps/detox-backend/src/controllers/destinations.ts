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
} as const;
