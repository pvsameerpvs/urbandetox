import { and, desc, eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { guideRequests } from "@/db/schema";

export interface GuideRequestInput {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  travelDates?: string;
  groupSize?: number;
  needs?: string;
  languages?: string[];
}

export const GuideRequestService = {
  /**
   * Public submission. Email is lowercased so the same person asking twice is
   * recognisable in the admin list, but duplicates are not rejected: someone
   * may legitimately want a guide in two places.
   */
  async submit(input: GuideRequestInput) {
    const [record] = await db
      .insert(guideRequests)
      .values({
        fullName: input.fullName.trim(),
        email: input.email.trim().toLowerCase(),
        phone: input.phone.trim(),
        location: input.location.trim(),
        travelDates: input.travelDates?.trim() || null,
        groupSize: input.groupSize ?? null,
        needs: input.needs?.trim() || null,
        languages: input.languages ?? [],
      })
      .returning();
    return record;
  },

  async list(status?: string) {
    const where = status ? eq(guideRequests.status, status) : undefined;
    return db
      .select()
      .from(guideRequests)
      .where(where ? and(where) : undefined)
      .orderBy(desc(guideRequests.createdAt));
  },

  async counts() {
    const rows = await db
      .select({ status: guideRequests.status, count: sql<number>`count(*)::int` })
      .from(guideRequests)
      .groupBy(guideRequests.status);
    return rows.reduce<Record<string, number>>((acc, r) => {
      acc[r.status] = r.count;
      return acc;
    }, {});
  },

  async update(id: string, patch: { status?: string; adminNotes?: string }) {
    const [record] = await db
      .update(guideRequests)
      .set({
        ...(patch.status !== undefined && { status: patch.status }),
        ...(patch.adminNotes !== undefined && { adminNotes: patch.adminNotes }),
        updatedAt: new Date(),
      })
      .where(eq(guideRequests.id, id))
      .returning();
    return record ?? null;
  },

  async remove(id: string) {
    const [record] = await db
      .delete(guideRequests)
      .where(eq(guideRequests.id, id))
      .returning();
    return record ?? null;
  },
};
