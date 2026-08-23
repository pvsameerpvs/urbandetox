import { Request, Response } from "express";
import { GuideApplicationService } from "@/services/guide-applications";

export const GuideApplicationController = {
  /** Public. Rate limited at the route. */
  async create(req: Request, res: Response) {
    const record = await GuideApplicationService.submit(req.body);
    // Deliberately terse: the public form does not need the stored row back.
    res.status(201).json({
      success: true,
      id: record.id,
      message: "Thanks for applying. We will be in touch.",
    });
  },

  async list(req: Request, res: Response) {
    const status = typeof req.query.status === "string" && req.query.status !== "all"
      ? req.query.status
      : undefined;
    const [applications, counts] = await Promise.all([
      GuideApplicationService.list(status),
      GuideApplicationService.counts(),
    ]);
    res.json({ applications, counts });
  },

  async update(req: Request, res: Response) {
    const record = await GuideApplicationService.update(String(req.params.id), {
      status: req.body.status,
      adminNotes: req.body.adminNotes,
    });
    if (!record) {
      res.status(404).json({ error: "Application not found" });
      return;
    }
    res.json(record);
  },

  async remove(req: Request, res: Response) {
    const record = await GuideApplicationService.remove(String(req.params.id));
    if (!record) {
      res.status(404).json({ error: "Application not found" });
      return;
    }
    res.json({ success: true });
  },
} as const;
