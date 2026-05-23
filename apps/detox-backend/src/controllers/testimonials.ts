import { Request, Response } from "express";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { testimonials } from "@/db/schema";

export const TestimonialController = {
  async list(req: Request, res: Response) {
    const l = req.query.limit && typeof req.query.limit === "string" ? parseInt(req.query.limit, 10) : 4;
    const result = await db.select().from(testimonials);
    res.json(result.slice(0, l));
  },

  async create(req: Request, res: Response) {
    const [record] = await db.insert(testimonials).values(req.body).returning();
    res.status(201).json(record);
  },

  async update(req: Request, res: Response) {
    const id = String(req.params.id);
    const [record] = await db
      .update(testimonials)
      .set(req.body)
      .where(eq(testimonials.id, id))
      .returning();
    if (!record) {
      res.status(404).json({ error: "Testimonial not found" });
      return;
    }
    res.json(record);
  },

  async remove(req: Request, res: Response) {
    const id = String(req.params.id);
    const [record] = await db
      .delete(testimonials)
      .where(eq(testimonials.id, id))
      .returning();
    if (!record) {
      res.status(404).json({ error: "Testimonial not found" });
      return;
    }
    res.json({ success: true });
  },
} as const;
