import { Request, Response } from "express";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";
import { sendEmail } from "@/services/email";
import { welcomeEmailTemplate } from "@/templates";

async function createUserAndSendWelcome(
  userId: string,
  email: string,
  overrides?: Partial<typeof users.$inferInsert>
) {
  try {
    const [created] = await db
      .insert(users)
      .values({
        id: userId,
        email,
        ...overrides,
      })
      .returning();

    if (created?.email) {
      const welcome = welcomeEmailTemplate({
        fullName: created.fullName || "Traveler",
        email: created.email,
      });
      await sendEmail({
        to: created.email,
        subject: "Welcome to Urban Detox — Your account is ready",
        html: welcome.html,
        text: welcome.text,
      });
    }

    return created;
  } catch (err) {
    // Handle race condition: another request already created this user
    const isUniqueViolation =
      err instanceof Error &&
      (err.message.includes("unique") || err.message.includes("duplicate"));

    if (isUniqueViolation) {
      const [existing] = await db
        .select()
        .from(users)
        .where(eq(users.id, userId));
      if (existing) return existing;

      // Fallback: find by email if ID somehow differs
      const [byEmail] = await db
        .select()
        .from(users)
        .where(eq(users.email, email));
      if (byEmail) return byEmail;
    }

    throw err;
  }
}

export const AuthController = {
  async me(req: Request, res: Response) {
    const userId = req.user!.id;
    const email = req.user!.email;
    const role = req.user!.role;
    const fullName = req.user!.fullName;
    const avatarUrl = req.user!.avatarUrl;

    try {
      const [profile] = await db.select().from(users).where(eq(users.id, userId));

      if (profile) {
        res.json({ ...profile, id: userId, email, role });
        return;
      }
    } catch (err) {
      console.error("[AuthController.me] DB lookup failed:", err);
    }

    // If DB lookup fails or user not found, try to create profile
    try {
      const profile = await createUserAndSendWelcome(userId, email, {
        fullName: fullName || undefined,
        avatarUrl: avatarUrl || undefined,
      });
      res.json({ ...profile, id: userId, email, role });
      return;
    } catch (err) {
      console.error("[AuthController.me] Failed to create user profile:", err);
    }

    // Final fallback — always return auth data so the admin can access the dashboard
    res.json({ id: userId, email, role });
  },

  async upsertProfile(req: Request, res: Response) {
    const userId = req.user!.id;
    const email = req.user!.email;
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

    const created = await createUserAndSendWelcome(userId, email, {
      fullName: fullName ?? req.user!.fullName ?? undefined,
      phone,
      dateOfBirth,
      gender,
      avatarUrl: avatarUrl ?? req.user!.avatarUrl ?? undefined,
    });

    res.status(201).json(created);
  },
} as const;
