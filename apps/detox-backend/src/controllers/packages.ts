import { Request, Response } from "express";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { packages } from "@/db/schema";

export const PackageController = {
  async list(req: Request, res: Response) {
    const { destination, featured } = req.query;
    let result = await db.select().from(packages);
    if (destination && typeof destination === "string") {
      result = result.filter((p) => p.destinationSlug === destination);
    }
    if (featured === "true") {
      result = result.filter((p) => p.featured);
    }
    res.json(result);
  },

  async getBySlug(req: Request, res: Response) {
    const slug = String(req.params.slug);
    const [pkg] = await db
      .select()
      .from(packages)
      .where(eq(packages.slug, slug));
    if (!pkg) {
      res.status(404).json({ error: "Package not found" });
      return;
    }
    res.json(pkg);
  },
} as const;
