import multer from "multer";
import { MAX_FILE_SIZE_MB, ALLOWED_FILE_TYPES } from "@/services/constants";

const MAX_FILE_SIZE = MAX_FILE_SIZE_MB * 1024 * 1024;

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: MAX_FILE_SIZE,
    files: 1,
  },
  fileFilter(_req, file, cb) {
    if (ALLOWED_FILE_TYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      const typeList = ALLOWED_FILE_TYPES.map((t) =>
        t.startsWith("image/") ? t.replace("image/", "") : t.replace("application/", "")
      ).join(", ");
      cb(new Error(`Only images and PDFs are allowed (${typeList})`));
    }
  },
});

export const singleUpload = upload.single("file");
