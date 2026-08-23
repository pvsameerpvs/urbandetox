import { Request, Response } from "express";
import { GuideRequestService } from "@/services/guide-requests";

export const GuideRequestController = {
  /** Public. Rate limited at the route. */
  async create(req: Request, res: Response) {
    const record = await GuideRequestService.submit(req.body);
    // Terse on purpose: an open endpoint should not echo the stored row back.
    res.status(201).json({
      success: true,
      id: record.id,
      message: "Got it. We will come back to you on WhatsApp or email.",
    });
  },

  async list(req: Request, res: Response) {
    const status =
      typeof req.query.status === "string" && req.query.status !== "all"
        ? req.query.status
        : undefined;
    const [requests, counts] = await Promise.all([
      GuideRequestService.list(status),
      GuideRequestService.counts(),
    ]);
    res.json({ requests, counts });
  },

  async update(req: Request, res: Response) {
    const record = await GuideRequestService.update(String(req.params.id), {
      status: req.body.status,
      adminNotes: req.body.adminNotes,
    });
    if (!record) {
      res.status(404).json({ error: "Request not found" });
      return;
    }
    res.json(record);
  },

  async remove(req: Request, res: Response) {
    const record = await GuideRequestService.remove(String(req.params.id));
    if (!record) {
      res.status(404).json({ error: "Request not found" });
      return;
    }
    res.json({ success: true });
  },
};
