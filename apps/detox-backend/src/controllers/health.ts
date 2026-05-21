import { Request, Response } from "express";

export const HealthController = {
  check(_req: Request, res: Response) {
    res.json({ status: "ok", service: "urbandetox-api" });
  },
} as const;
