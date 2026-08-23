import { Request, Response } from "express";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { destinations } from "@/db/schema";

export const DestinationController = {
  /**
   * Public callers only ever see active destinations. The dashboard passes
   * status=all to work on hidden and coming_soon rows.
   *
   * This used to return every row unfiltered, so a destination set to Hidden
   * still rendered on the homepage grid and still linked to a live detail
   * page, which is the opposite of what the admin form promises.
   */
  async list(req: Request, res: Response) {
    const status = req.query.status;
    const result =
      status === "all"
        ? await db.select().from(destinations)
        : await db
            .select()
            .from(destinations)
            .where(eq(destinations.status, typeof status === "string" && status ? status : "active"));
    res.json(result);
  },

  async getBySlug(req: Request, res: Response) {
    const slug = String(req.params.slug);
    const [dest] = await db
      .select()
      .from(destinations)
      .where(eq(destinations.slug, slug));
    // A hidden or coming_soon destination is not published, so its detail page
    // must 404 for the public exactly as an unknown slug does.
    const hidden = dest && (dest.status ?? "active") !== "active";
    if (!dest || (hidden && req.query.status !== "all")) {
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
