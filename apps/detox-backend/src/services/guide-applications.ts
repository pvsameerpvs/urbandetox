import { desc, eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { guideApplications } from "@/db/schema";

export const APPLICATION_STATUSES = [
  "new",
  "reviewing",
  "shortlisted",
  "rejected",
  "hired",
] as const;

export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number];

export interface GuideApplicationInput {
  fullName: string;
  email: string;
  phone: string;
  city?: string;
  destinations?: string[];
  languages?: string[];
  experienceYears?: number;
  experience?: string;
  about?: string;
  instagram?: string;
  resumeUrl?: string;
  photoUrl?: string;
}

export const GuideApplicationService = {
  /**
   * Public submission. Re-applying with the same email updates the existing
   * row rather than erroring, so an applicant can correct a typo without
   * support having to intervene. Admin status and notes are preserved.
   */
  async submit(input: GuideApplicationInput) {
    const email = input.email.trim().toLowerCase();

    const [record] = await db
      .insert(guideApplications)
      .values({
        fullName: input.fullName.trim(),
        email,
        phone: input.phone.trim(),
        city: input.city?.trim() || null,
        destinations: input.destinations ?? [],
        languages: input.languages ?? [],
        experienceYears: input.experienceYears ?? null,
        experience: input.experience?.trim() || null,
        about: input.about?.trim() || null,
        instagram: input.instagram?.trim() || null,
        resumeUrl: input.resumeUrl || null,
        photoUrl: input.photoUrl || null,
      })
      .onConflictDoUpdate({
        target: guideApplications.email,
        set: {
          fullName: input.fullName.trim(),
          phone: input.phone.trim(),
          city: input.city?.trim() || null,
          destinations: input.destinations ?? [],
          languages: input.languages ?? [],
          experienceYears: input.experienceYears ?? null,
          experience: input.experience?.trim() || null,
          about: input.about?.trim() || null,
          instagram: input.instagram?.trim() || null,
          resumeUrl: input.resumeUrl || null,
          photoUrl: input.photoUrl || null,
          updatedAt: new Date(),
        },
      })
      .returning();

    return record;
  },

  async list(status?: string) {
    const rows = status
      ? await db
          .select()
          .from(guideApplications)
          .where(eq(guideApplications.status, status))
          .orderBy(desc(guideApplications.createdAt))
      : await db
          .select()
          .from(guideApplications)
          .orderBy(desc(guideApplications.createdAt));
    return rows;
  },

  async counts() {
    const rows = await db
      .select({ status: guideApplications.status, count: sql<number>`count(*)::int` })
      .from(guideApplications)
      .groupBy(guideApplications.status);
    return Object.fromEntries(rows.map((r) => [r.status, r.count]));
  },

  async update(id: string, patch: { status?: string; adminNotes?: string }) {
    const [record] = await db
      .update(guideApplications)
      .set({ ...patch, updatedAt: new Date() })
      .where(eq(guideApplications.id, id))
      .returning();
    return record ?? null;
  },

  async remove(id: string) {
    const [record] = await db
      .delete(guideApplications)
      .where(eq(guideApplications.id, id))
      .returning();
    return record ?? null;
  },
} as const;
