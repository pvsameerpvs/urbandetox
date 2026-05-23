import { Request, Response } from "express";
import { uploadToR2, isValidFolder, type UploadFolder } from "@/services/upload";
import { MAX_FILE_SIZE_MB } from "@/services/constants";

export const UploadController = {
  async upload(req: Request, res: Response) {
    if (!req.file) {
      res.status(400).json({ error: "No file provided" });
      return;
    }

    const folderParam = req.query.folder as string | undefined;
    let folder: UploadFolder = "general";
    if (folderParam && isValidFolder(folderParam)) {
      folder = folderParam;
    }

    try {
      const result = await uploadToR2(req.file, folder);
      res.status(201).json(result);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Upload failed";
      res.status(400).json({ error: message });
    }
  },

  getLimits(_req: Request, res: Response) {
    res.json({
      maxSizeBytes: MAX_FILE_SIZE_MB * 1024 * 1024,
      maxSizeMB: MAX_FILE_SIZE_MB,
      allowedTypes: ["image/jpeg", "image/png", "image/webp", "image/gif"],
    });
  },
} as const;
