import { getR2Client } from "@/config/r2";
import { ENV } from "@/config/env";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";
import path from "path";

const ALLOWED_FOLDERS = [
  "destinations",
  "packages",
  "gallery",
  "avatars",
  "heroes",
  "guides",
  "testimonials",
  "general",
] as const;

export type UploadFolder = (typeof ALLOWED_FOLDERS)[number];

const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export interface UploadResult {
  url: string;
  key: string;
}

export function isValidFolder(folder: string): folder is UploadFolder {
  return ALLOWED_FOLDERS.includes(folder as UploadFolder);
}

export function validateFile(file: Express.Multer.File): void {
  if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    throw new Error(
      `Invalid file type. Allowed: ${ALLOWED_MIME_TYPES.map((t) => t.replace("image/", "")).join(", ")}`
    );
  }
  if (file.size > MAX_FILE_SIZE) {
    throw new Error(`File too large. Max size is ${MAX_FILE_SIZE / 1024 / 1024}MB.`);
  }
}

export function generateKey(
  folder: UploadFolder,
  originalName: string
): string {
  const ext = path.extname(originalName) || ".jpg";
  const id = uuidv4();
  return `${folder}/${id}${ext}`;
}

export async function uploadToR2(
  file: Express.Multer.File,
  folder: UploadFolder = "general"
): Promise<UploadResult> {
  validateFile(file);

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
