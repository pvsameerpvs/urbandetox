"use client";

import { useRef, useState } from "react";
import { Button } from "@urbandetox/ui";
import { Upload, X, FileText, Loader2, FileCheck } from "lucide-react";
import { uploadFile } from "@/lib/api";

interface PdfUploadProps {
  value: string;
  onChange: (value: string) => void;
  maxSizeMB?: number;
  label?: string;
  folder?: string;
}

export function PdfUpload({ value, onChange, maxSizeMB = 30, folder = "general" }: PdfUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  async function handleFile(file: File) {
    setError(null);
    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`PDF too large. Max ${maxSizeMB}MB.`);
      return;
    }
    if (file.type !== "application/pdf") {
      setError("Only PDF files are allowed.");
      return;
    }

    setIsUploading(true);
    try {
      const result = await uploadFile(file, folder);
      onChange(result.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setIsUploading(false);
    }
  }

  const hasPdf = value && value.length > 0;
  const fileName = hasPdf ? value.split("/").pop()?.split("?")[0] || "itinerary.pdf" : "";

  return (
    <div className="space-y-3">
      <div
        className={`relative rounded-xl overflow-hidden border-2 border-dashed transition-colors ${
          hasPdf ? "border-brand/40 bg-brand/[0.03]" : "border-border/60 hover:border-brand/40 bg-secondary/[0.03]"
        }`}
      >
        {hasPdf ? (
          <div className="flex items-center gap-4 p-4">
            <div className="h-12 w-12 rounded-xl bg-brand/10 flex items-center justify-center shrink-0">
              <FileCheck className="h-6 w-6 text-brand" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{fileName}</p>
              <p className="text-xs text-muted-foreground">PDF uploaded</p>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                className="h-8 rounded-lg text-xs"
                onClick={() => inputRef.current?.click()}
                disabled={isUploading}
              >
                {isUploading ? <Loader2 className="h-3 w-3 mr-1 animate-spin" /> : <Upload className="h-3 w-3 mr-1" />}
                {isUploading ? "Uploading" : "Change"}
              </Button>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                className="h-8 rounded-lg text-xs hover:bg-red-50 hover:text-red-600"
                onClick={() => onChange("")}
                disabled={isUploading}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={isUploading}
            className="w-full flex flex-col items-center justify-center gap-2 text-muted-foreground hover:text-brand transition-colors disabled:opacity-50 py-8"
          >
            {isUploading ? (
              <Loader2 className="h-8 w-8 animate-spin text-brand" />
            ) : (
              <div className="h-12 w-12 rounded-xl bg-secondary/50 flex items-center justify-center">
                <FileText className="h-6 w-6" />
              </div>
            )}
            <div className="text-center">
              <p className="text-sm font-medium">
                {isUploading ? "Uploading PDF..." : "Click to upload itinerary PDF"}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">PDF up to {maxSizeMB}MB</p>
            </div>
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="application/pdf"
        className="hidden"
        disabled={isUploading}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = "";
        }}
      />

      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
