import { getR2Client } from "@/config/r2";
import { ENV } from "@/config/env";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import { MAX_FILE_SIZE_MB } from "@/services/constants";

/**
 * ── R2 Folder Structure ───────────────────────────────────────────────
 *
 * These root prefixes define the logical organization of the urbandetox bucket.
 * You may upload to a root directly (e.g. "destinations") or to a subpath
 * (e.g. "destinations/covers", "packages/itinerary").
 *
 * Recommended structure:
 *   destinations/covers       → Destination hero / listing images
 *   destinations/gallery        → Destination detail galleries
 *   packages/covers           → Package hero / card images
 *   packages/gallery          → Package detail galleries
 *   packages/itinerary        → Day-by-day itinerary photos
 *   guides/covers             → Guide article featured images
 *   marketing/heroes          → Homepage hero backgrounds
 *   marketing/banners         → Promo banners
 *   marketing/seasonal        → Seasonal campaign images
 *   testimonials/avatars      → Customer testimonial photos
 *   users/avatars             → Registered user profile pictures
 *   bookings/id-docs          → Traveler ID uploads (Aadhaar, Passport, DL)
 *   bookings/photos           → Traveler passport-size photos
 *   cms/general               → Uncategorized admin uploads
 *   temp/                     → Temporary / pre-processing uploads
 *
 * Legacy roots (backward compatible):
 *   avatars  → maps to users/avatars
 *   heroes   → maps to marketing/heroes
 *   gallery  → maps to cms/gallery
 *   general  → maps to cms/general
 * ──────────────────────────────────────────────────────────────────────
 */
const ALLOWED_ROOT_FOLDERS = [
  // Organized domain roots
  "destinations",
  "packages",
  "guides",
  "marketing",
  "testimonials",
  "users",
  "bookings",
  "cms",
  "temp",
  // Legacy roots (kept for backward compatibility)
  "avatars",
  "heroes",
  "gallery",
  "general",
] as const;

const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "application/pdf",
];

const MAX_FILE_SIZE = MAX_FILE_SIZE_MB * 1024 * 1024;

interface UploadResult {
  url: string;
  key: string;
}

/**
 * Validate that a folder path starts with one of the allowed roots.
 * Accepts both root names ("destinations") and subpaths ("destinations/covers").
 */
export function isValidFolder(folder: string): boolean {
  return ALLOWED_ROOT_FOLDERS.some(
    (root) => folder === root || folder.startsWith(`${root}/`)
  );
}

function validateFile(file: Express.Multer.File): void {
  if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    throw new Error(
      `Invalid file type. Allowed: ${ALLOWED_MIME_TYPES.map((t) => t.replace("image/", "")).join(", ")}`
    );
  }
  if (file.size > MAX_FILE_SIZE) {
    throw new Error(
      `File too large. Max size is ${MAX_FILE_SIZE / 1024 / 1024}MB.`
    );
  }
}

/**
 * Generate a unique R2 object key under the requested folder/subpath.
 * Example: "packages/itinerary/uuid.webp"
 */
function generateKey(
  folder: string,
  originalName: string
): string {
  const ext = path.extname(originalName) || ".jpg";
  const id = uuidv4();
  return `${folder}/${id}${ext}`;
}

export async function uploadToR2(
  file: Express.Multer.File,
  folder: string = "general"
): Promise<UploadResult> {
  validateFile(file);

  if (!isValidFolder(folder)) {
    throw new Error(
      `Invalid upload folder "${folder}". Allowed roots: ${ALLOWED_ROOT_FOLDERS.join(", ")}`
    );
  }

  const key = generateKey(folder, file.originalname);
  const bucket = ENV.R2_BUCKET_NAME;

  if (!bucket) {
    throw new Error("R2_BUCKET_NAME is not configured");
  }

  await getR2Client().send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
      ContentLength: file.size,
    })
  );

  if (!ENV.R2_PUBLIC_URL) {
    throw new Error(
      "R2_PUBLIC_URL is not configured. Set it to your public bucket URL (e.g. https://pub-xxx.r2.dev or your custom domain)."
    );
  }

  const publicUrl = `${ENV.R2_PUBLIC_URL.replace(/\/$/, "")}/${key}`;

  return {
    url: publicUrl,
    key,
  };
}
