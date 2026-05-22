import { Request, Response } from "express";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";

export const AuthController = {
  async me(req: Request, res: Response) {
    const userId = req.user!.id;
    const [profile] = await db.select().from(users).where(eq(users.id, userId));
    res.json({
      ...profile,
      id: userId,
      email: req.user!.email,
    });
  },

  async upsertProfile(req: Request, res: Response) {
    const userId = req.user!.id;
    const { fullName, phone, dateOfBirth, gender, avatarUrl } = req.body;

    const [existing] = await db.select().from(users).where(eq(users.id, userId));

    if (existing) {
      const [updated] = await db
        .update(users)
        .set({
          ...(fullName !== undefined && { fullName }),
          ...(phone !== undefined && { phone }),
          ...(dateOfBirth !== undefined && { dateOfBirth }),
          ...(gender !== undefined && { gender }),
          ...(avatarUrl !== undefined && { avatarUrl }),
          updatedAt: new Date(),
        })
        .where(eq(users.id, userId))
        .returning();
      res.json(updated);
      return;
    }

    const [created] = await db
      .insert(users)
      .values({
        id: userId,
        email: req.user!.email,
        fullName,
        phone,
        dateOfBirth,
        gender,
        avatarUrl,
      })
      .returning();
    res.status(201).json(created);
  },
} as const;
