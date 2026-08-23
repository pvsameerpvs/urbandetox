import crypto from "node:crypto";
import path from "node:path";
import { supabaseAdmin } from "@/lib/supabase";

/**
 * Storage for traveller documents: ID proofs and personal photos.
 *
 * These do NOT go in the R2 bucket. R2 is fronted by a public r2.dev URL that
 * exposes every object in it, so anything written there is readable by anyone
 * holding the key, with no expiry and no way to revoke.
 *
 * Instead they live in a private Supabase Storage bucket and are only ever
 * handed out as short-lived signed URLs. What we persist on the booking is the
 * storage PATH, never a URL, so a leaked database row grants nothing on its own.
 */
export const PRIVATE_BUCKET = process.env.PRIVATE_DOCS_BUCKET || "traveller-documents";

/** Signed links are for one immediate view, so keep the window short. */
const SIGNED_URL_TTL_SECONDS = 300;

const ALLOWED_MIME = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
] as const;

const MAX_BYTES = 30 * 1024 * 1024;

export type DocumentKind = "photo" | "id";

export interface StoredDocument {
  /** Path inside the private bucket. Persist this, not a URL. */
  path: string;
}

function extensionFor(mime: string, originalName?: string): string {
  const fromName = originalName ? path.extname(originalName).toLowerCase() : "";
  if (fromName) return fromName;
  if (mime === "application/pdf") return ".pdf";
  if (mime === "image/png") return ".png";
  if (mime === "image/webp") return ".webp";
  return ".jpg";
}

export const PrivateStorage = {
  /**
   * Paths are namespaced by booking so a signed URL can be authorised by
   * checking the caller's access to that booking, and never guessed.
   */
  buildPath(bookingId: string, kind: DocumentKind, mime: string, originalName?: string) {
    const id = crypto.randomUUID();
    return `${bookingId}/${kind}-${id}${extensionFor(mime, originalName)}`;
  },

  async upload(input: {
    bookingId: string;
    kind: DocumentKind;
    buffer: Buffer;
    mimeType: string;
    originalName?: string;
  }): Promise<StoredDocument> {
    if (!ALLOWED_MIME.includes(input.mimeType as (typeof ALLOWED_MIME)[number])) {
      throw new Error(
        `Unsupported file type. Allowed: JPEG, PNG, WebP or PDF.`
      );
    }
    if (input.buffer.length > MAX_BYTES) {
      throw new Error(`File too large. Maximum is ${MAX_BYTES / 1024 / 1024}MB.`);
    }

    const objectPath = PrivateStorage.buildPath(
      input.bookingId,
      input.kind,
      input.mimeType,
      input.originalName
    );

    const { error } = await supabaseAdmin.storage
      .from(PRIVATE_BUCKET)
      .upload(objectPath, input.buffer, {
        contentType: input.mimeType,
        upsert: false,
      });

    if (error) throw new Error(`Upload failed: ${error.message}`);
    return { path: objectPath };
  },

  /** Short-lived read URL. Callers must authorise access to the booking first. */
  async signedUrl(objectPath: string, ttlSeconds = SIGNED_URL_TTL_SECONDS) {
    const { data, error } = await supabaseAdmin.storage
      .from(PRIVATE_BUCKET)
      .createSignedUrl(objectPath, ttlSeconds);
    if (error || !data) throw new Error(error?.message || "Could not sign the document URL");
    return { url: data.signedUrl, expiresInSeconds: ttlSeconds };
  },

  /** The booking id a path belongs to, used to authorise access. */
  bookingIdFromPath(objectPath: string): string | null {
    const first = objectPath.split("/")[0];
    return /^[0-9a-f-]{36}$/i.test(first) ? first : null;
  },

  async remove(objectPath: string) {
    const { error } = await supabaseAdmin.storage.from(PRIVATE_BUCKET).remove([objectPath]);
    if (error) throw new Error(error.message);
  },
} as const;
