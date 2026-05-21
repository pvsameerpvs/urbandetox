import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import {
  destinations,
  getDestinationBySlug,
  packages,
  getPackageBySlug,
  getPackagesByDestination,
  getFeaturedPackages,
  departures,
  getDeparturesByPackageSlug,
  getDepartureByCode,
  getUpcomingDepartures,
  getAllGuides,
  getGuideBySlug,
  getFeaturedGuides,
  getRelatedGuides,
  getGuideCategories,
  faqs,
  getAllFaqs,
  getFaqCategories,
  testimonials,
  getTestimonials,
} from "@urbandetox/utils";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// ── Health ──────────────────────────────────────────
app.get("/health", (_req: Request, res: Response) => {
  res.json({ status: "ok", service: "urbandetox-api" });
});

// ── Destinations ────────────────────────────────────
app.get("/api/destinations", (_req: Request, res: Response) => {
  res.json(destinations);
});

app.get("/api/destinations/:slug", (req: Request, res: Response) => {
  const slug = Array.isArray(req.params.slug) ? req.params.slug[0] : req.params.slug;
  const dest = getDestinationBySlug(slug);
  if (!dest) return res.status(404).json({ error: "Destination not found" });
  res.json(dest);
});

// ── Packages ────────────────────────────────────────
app.get("/api/packages", (req: Request, res: Response) => {
  const { destination, featured } = req.query;
  let result = packages;
  if (destination && typeof destination === "string") {
    result = getPackagesByDestination(destination);
  }
  if (featured === "true") {
    result = result.filter((p) => p.featured);
  }
  res.json(result);
});

app.get("/api/packages/:slug", (req: Request, res: Response) => {
  const slug = Array.isArray(req.params.slug) ? req.params.slug[0] : req.params.slug;
  const pkg = getPackageBySlug(slug);
  if (!pkg) return res.status(404).json({ error: "Package not found" });
  res.json(pkg);
});

// ── Departures ──────────────────────────────────────
app.get("/api/departures", (req: Request, res: Response) => {
  const { package: pkgSlug, upcoming, limit } = req.query;
  let result = departures;
  if (pkgSlug && typeof pkgSlug === "string") {
    result = getDeparturesByPackageSlug(pkgSlug);
  }
  if (upcoming === "true") {
    const l = limit && typeof limit === "string" ? parseInt(limit, 10) : 6;
    result = getUpcomingDepartures(l);
  }
  res.json(result);
});

app.get("/api/departures/:code", (req: Request, res: Response) => {
  const code = Array.isArray(req.params.code) ? req.params.code[0] : req.params.code;
  const dep = getDepartureByCode(code);
  if (!dep) return res.status(404).json({ error: "Departure not found" });
  res.json(dep);
});

// ── Guides ──────────────────────────────────────────
app.get("/api/guides", (req: Request, res: Response) => {
  const { featured, limit, category } = req.query;
  let result = getAllGuides();
  if (category && typeof category === "string") {
    result = result.filter((g) => g.category === category);
  }
  if (featured === "true") {
    const l = limit && typeof limit === "string" ? parseInt(limit, 10) : 4;
    result = getFeaturedGuides(l);
  }
  res.json(result);
});

app.get("/api/guides/categories", (_req: Request, res: Response) => {
  res.json(getGuideCategories());
});

app.get("/api/guides/:slug", (req: Request, res: Response) => {
  const slug = Array.isArray(req.params.slug) ? req.params.slug[0] : req.params.slug;
  const guide = getGuideBySlug(slug);
  if (!guide) return res.status(404).json({ error: "Guide not found" });
  res.json(guide);
});

app.get("/api/guides/:slug/related", (req: Request, res: Response) => {
  const slug = Array.isArray(req.params.slug) ? req.params.slug[0] : req.params.slug;
  const l = req.query.limit && typeof req.query.limit === "string" ? parseInt(req.query.limit, 10) : 3;
  res.json(getRelatedGuides(slug, l));
});

// ── FAQs ────────────────────────────────────────────
app.get("/api/faqs", (req: Request, res: Response) => {
  const { category } = req.query;
  if (category && typeof category === "string") {
    res.json(faqs.filter((f) => f.category === category));
  } else {
    res.json(getAllFaqs());
  }
});

app.get("/api/faqs/categories", (_req: Request, res: Response) => {
  res.json(getFaqCategories());
});

// ── Testimonials ────────────────────────────────────
app.get("/api/testimonials", (req: Request, res: Response) => {
  const l = req.query.limit && typeof req.query.limit === "string" ? parseInt(req.query.limit, 10) : 4;
  res.json(getTestimonials(l));
});

// ── Bookings (in-memory store) ──────────────────────
interface BookingRecord {
  id: string;
  departureCode: string;
  fullName: string;
  phone: string;
  email?: string;
  travelers: number;
  createdAt: string;
}

const bookings: BookingRecord[] = [];

app.get("/api/bookings", (_req: Request, res: Response) => {
  res.json(bookings);
});

app.post("/api/bookings", (req: Request, res: Response) => {
  const { departureCode, fullName, phone, email, travelers } = req.body;
  if (!departureCode || !fullName || !phone) {
    return res.status(400).json({ error: "departureCode, fullName, and phone are required" });
  }
  const dep = getDepartureByCode(departureCode);
  if (!dep) {
    return res.status(404).json({ error: "Departure not found" });
  }
  const booking: BookingRecord = {
    id: `booking-${Date.now()}`,
    departureCode,
    fullName,
    phone,
    email,
    travelers: travelers ?? 1,
    createdAt: new Date().toISOString(),
  };
  bookings.push(booking);
  res.status(201).json(booking);
});

app.listen(PORT, () => {
  console.log(`Urban Detox API running on http://localhost:${PORT}`);
});
