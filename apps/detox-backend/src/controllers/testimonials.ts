import { Request, Response } from "express";
import { db } from "@/db";
import { testimonials } from "@/db/schema";

export const TestimonialController = {
  async list(req: Request, res: Response) {
    const l = req.query.limit && typeof req.query.limit === "string" ? parseInt(req.query.limit, 10) : 4;
    const result = await db.select().from(testimonials);
    res.json(result.slice(0, l));
  },
} as const;
