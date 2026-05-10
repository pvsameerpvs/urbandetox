import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Health check
app.get("/health", (_req: Request, res: Response) => {
  res.json({ status: "ok", service: "urbandetox-api" });
});

// Placeholder routes for future Supabase integration
app.get("/api/destinations", (_req: Request, res: Response) => {
  res.json({ message: "Destinations endpoint — connect to Supabase later" });
});

app.get("/api/packages", (_req: Request, res: Response) => {
  res.json({ message: "Packages endpoint — connect to Supabase later" });
});

app.get("/api/departures", (_req: Request, res: Response) => {
  res.json({ message: "Departures endpoint — connect to Supabase later" });
});

app.get("/api/bookings", (_req: Request, res: Response) => {
  res.json({ message: "Bookings endpoint — connect to Supabase later" });
});

app.listen(PORT, () => {
  console.log(`Urban Detox API running on http://localhost:${PORT}`);
});
