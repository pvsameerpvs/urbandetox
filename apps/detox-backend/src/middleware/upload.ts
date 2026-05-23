import multer from "multer";
import { MAX_FILE_SIZE_MB, ALLOWED_IMAGE_TYPES } from "@/services/constants";

export const MAX_FILE_SIZE = MAX_FILE_SIZE_MB * 1024 * 1024;

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: MAX_FILE_SIZE,
    files: 1,
  },
  fileFilter(_req, file, cb) {
    if (ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`Only images are allowed (${ALLOWED_IMAGE_TYPES.map((t) => t.replace("image/", "")).join(", ")})`));
    }
  },
});

export const singleUpload = upload.single("file");
