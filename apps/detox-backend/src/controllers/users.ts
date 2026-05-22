import { Request, Response } from "express";
import { z } from "zod";
import { UserService } from "@/services/users";

const listUsersQuery = z.object({
  search: z.string().optional(),
  role: z.enum(["admin", "authenticated"]).optional(),
  sortBy: z.enum(["createdAt", "fullName", "email"]).optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
  page: z.string().regex(/^\d+$/).optional(),
  pageSize: z.string().regex(/^\d+$/).optional(),
});

export const UserController = {
  async list(req: Request, res: Response) {
    const parsed = listUsersQuery.parse(req.query);

    const result = await UserService.list({
      search: parsed.search,
      role: parsed.role,
      sortBy: parsed.sortBy,
      sortOrder: parsed.sortOrder,
      page: parsed.page ? Number(parsed.page) : undefined,
      pageSize: parsed.pageSize ? Number(parsed.pageSize) : undefined,
    });

    res.json(result);
  },

  async getById(req: Request, res: Response) {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    if (!id) {
      res.status(400).json({ error: "Missing user id" });
      return;
    }
    const user = await UserService.getById(id);
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    res.json(user);
  },

  async updateRole(req: Request, res: Response) {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const { role } = req.body;

    if (!id || !role || !["admin", "authenticated"].includes(role)) {
      res.status(400).json({ error: "Invalid request" });
      return;
    }

    const updated = await UserService.updateRole(id, role);
    if (!updated) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    res.json(updated);
  },
} as const;
