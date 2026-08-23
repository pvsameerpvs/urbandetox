import { Request, Response } from "express";
import { and, eq, gte, lte, or, ilike, sql, type SQL } from "drizzle-orm";
import type { AnyPgColumn } from "drizzle-orm/pg-core";
import { db } from "@/db";
import { packages } from "@/db/schema";
import { BUDGET_BANDS } from "@urbandetox/utils";

/** Comma-separated query value -> trimmed, non-empty list. */
function list(value: unknown): string[] {
  if (typeof value !== "string") return [];
  return value.split(",").map((v) => v.trim()).filter(Boolean);
}

/**
 * Matches when a jsonb string array contains any of `values`.
 *
 * Built from parameterised `@>` containment checks rather than `?|` with a raw
 * array literal, so caller-supplied values are never interpolated into SQL.
 */
function jsonbOverlaps(column: AnyPgColumn, values: string[]) {
  return or(
    ...values.map((v) => sql`${column} @> ${JSON.stringify([v])}::jsonb`)
  ) as SQL;
}

export const PackageController = {
  async list(req: Request, res: Response) {
    const q = req.query;
    const filters: SQL[] = [];

    if (typeof q.destination === "string" && q.destination) {
      filters.push(eq(packages.destinationSlug, q.destination));
    }
    if (q.featured === "true") filters.push(eq(packages.featured, true));
    if (q.featured === "false") filters.push(eq(packages.featured, false));

    // Public callers only ever see live packages. The dashboard passes
    // status=all to work on drafts.
    if (typeof q.status === "string" && q.status !== "all") {
      filters.push(eq(packages.status, q.status));
    } else if (q.status !== "all") {
      filters.push(eq(packages.status, "live"));
    }

    const audiences = list(q.audience);
    if (audiences.length) filters.push(jsonbOverlaps(packages.audiences, audiences));
    const themes = list(q.theme);
    if (themes.length) filters.push(jsonbOverlaps(packages.themes, themes));
    const terrains = list(q.terrain);
    if (terrains.length) filters.push(jsonbOverlaps(packages.terrains, terrains));

    if (q.domestic === "true") filters.push(eq(packages.isDomestic, true));
    if (q.domestic === "false") filters.push(eq(packages.isDomestic, false));
    if (q.weekend === "true") filters.push(eq(packages.isWeekend, true));

    const fitness = list(q.fitness);
    if (fitness.length) {
      filters.push(
        or(...fitness.map((f) => eq(packages.fitnessLevel, f))) as SQL
      );
    }

    const durations = list(q.duration).map(Number).filter((n) => Number.isFinite(n));
    if (durations.length) {
      filters.push(or(...durations.map((d) => eq(packages.duration, d))) as SQL);
    }

    /**
     * Budget arrives as one or more band values and each band becomes its own
     * range, OR'd together. The page used to flatten them into a single
     * min/max span client-side, so picking "Under 10,000" plus
     * "15,000 - 25,000" searched 0 to 24,999 and returned every trip in the
     * 10,000 to 15,000 band the visitor had explicitly not selected. Picking
     * any band with an open top (above-25000, max null) dropped maxPrice
     * altogether and silently disabled the filter while its pill still read
     * as active.
     */
    const bandRanges = list(q.budget)
      .map((v) => BUDGET_BANDS.find((b) => b.value === v))
      .filter((b): b is (typeof BUDGET_BANDS)[number] => Boolean(b))
      .map((b) => {
        const lo = gte(packages.startingPrice, String(b.min));
        return b.max === null ? lo : (and(lo, lte(packages.startingPrice, String(b.max))) as SQL);
      });
    if (bandRanges.length) {
      filters.push(bandRanges.length === 1 ? bandRanges[0] : (or(...bandRanges) as SQL));
    }

    if (typeof q.minPrice === "string" && q.minPrice !== "") {
      filters.push(gte(packages.startingPrice, q.minPrice));
    }
    if (typeof q.maxPrice === "string" && q.maxPrice !== "") {
      filters.push(lte(packages.startingPrice, q.maxPrice));
    }

    if (typeof q.seasonalTag === "string" && q.seasonalTag) {
      filters.push(eq(packages.seasonalTag, q.seasonalTag));
    }

    // Free-text search across the fields a customer would actually type.
    if (typeof q.q === "string" && q.q.trim()) {
      const term = `%${q.q.trim()}%`;
      filters.push(
        or(
          ilike(packages.title, term),
          ilike(packages.subtitle, term),
          ilike(packages.destinationSlug, term),
          ilike(packages.style, term)
        ) as SQL
      );
    }

    const rows = filters.length
      ? await db.select().from(packages).where(and(...filters))
      : await db.select().from(packages);

    res.json(rows);
  },

  async getBySlug(req: Request, res: Response) {
    const slug = String(req.params.slug);
    const [pkg] = await db.select().from(packages).where(eq(packages.slug, slug));
    /**
     * list() has always restricted public callers to live packages, but this
     * did not, so a draft, sold_out or coming_soon trip was unreachable from
     * any listing yet rendered as a normal bookable page on a direct link.
     * status=all keeps the dashboard able to open drafts.
     */
    const unpublished = pkg && (pkg.status ?? "live") !== "live";
    if (!pkg || (unpublished && req.query.status !== "all")) {
      res.status(404).json({ error: "Package not found" });
      return;
    }
    res.json(pkg);
  },

  async create(req: Request, res: Response) {
    const [record] = await db.insert(packages).values(req.body).returning();
    res.status(201).json(record);
  },

  async update(req: Request, res: Response) {
    const slug = String(req.params.slug);
    const [record] = await db
      .update(packages)
      .set(req.body)
      .where(eq(packages.slug, slug))
      .returning();
    if (!record) {
      res.status(404).json({ error: "Package not found" });
      return;
    }
    res.json(record);
  },

  async remove(req: Request, res: Response) {
    const slug = String(req.params.slug);
    const [record] = await db
      .delete(packages)
      .where(eq(packages.slug, slug))
      .returning();
    if (!record) {
      res.status(404).json({ error: "Package not found" });
      return;
    }
    res.json({ success: true });
  },
} as const;
