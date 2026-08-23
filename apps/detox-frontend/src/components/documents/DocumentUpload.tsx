"use client";

import { useRef, useState } from "react";
import { Check, FileText, Loader2, Upload } from "lucide-react";
import { Label } from "@urbandetox/ui";
import { uploadTravellerDocument } from "@/lib/api";

interface DocumentUploadProps {
  label: string;
  hint?: string;
  kind: "photo" | "id";
  bookingId: string;
  /** Omitted for the signed-in booking owner; required for share-link access. */
  token?: string;
  /** Storage path already saved for this document, if any. */
  value?: string;
  onUploaded: (storagePath: string) => void;
}

const MAX_MB = 30;

export function DocumentUpload({
  label,
  hint,
  kind,
  bookingId,
  token,
  value,
  onUploaded,
}: DocumentUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pick = async (file: File) => {
    setError(null);
    if (file.size > MAX_MB * 1024 * 1024) {
      setError(`That file is over ${MAX_MB}MB.`);
      return;
    }
    setBusy(true);
    try {
      const { path } = await uploadTravellerDocument({ file, bookingId, kind, token });
      onUploaded(path);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-semibold">{label}</Label>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={busy}
        className="flex w-full items-center gap-3 rounded-xl border border-dashed border-border bg-background p-3 text-left transition-colors hover:border-brand/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 disabled:opacity-60"
      >
        <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary">
          {busy ? (
            <Loader2 className="h-4 w-4 animate-spin text-brand" />
          ) : value ? (
            <Check className="h-4 w-4 text-emerald-600" />
          ) : kind === "id" ? (
            <FileText className="h-4 w-4 text-muted-foreground" />
          ) : (
            <Upload className="h-4 w-4 text-muted-foreground" />
          )}
        </span>
        <span className="min-w-0">
          <span className="block text-sm font-medium">
            {busy ? "Uploading..." : value ? "Uploaded" : "Choose a file"}
          </span>
          <span className="block text-[11px] text-muted-foreground">
            {hint ?? "JPG, PNG or PDF, up to 30MB"}
          </span>
        </span>
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,application/pdf"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) void pick(f);
          e.target.value = "";
        }}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
      {value && (
        <p className="text-[11px] text-muted-foreground">
          Stored privately. Only our team can open it.
        </p>
      )}
    </div>
  );
}
