"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Button } from "@urbandetox/ui";
import { Upload, X, ImageIcon } from "lucide-react";

interface ImageUploadProps {
  value: string;
  onChange: (value: string) => void;
  maxSizeMB?: number;
  label?: string;
}

export function ImageUpload({ value, onChange, maxSizeMB = 5 }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  function handleFile(file: File) {
    setError(null);
    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`Image too large. Max ${maxSizeMB}MB.`);
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      onChange(reader.result as string);
    };
    reader.readAsDataURL(file);
  }

  const hasImage = value && (value.startsWith("http") || value.startsWith("data:image"));

  return (
    <div className="space-y-3">
      <div
        className={`relative rounded-xl overflow-hidden border-2 border-dashed transition-colors ${
          hasImage ? "border-border/40" : "border-border/60 hover:border-brand/40 bg-secondary/[0.03]"
        }`}
      >
        {hasImage ? (
          <div className="relative aspect-[16/9] w-full">
            <Image src={value} alt="Cover preview" fill className="object-cover" sizes="600px" unoptimized />
            <div className="absolute top-2 right-2 flex items-center gap-1.5">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                className="h-8 rounded-lg bg-black/60 text-white hover:bg-black/80 backdrop-blur-sm border-0 text-xs"
                onClick={() => inputRef.current?.click()}
              >
                <Upload className="h-3 w-3 mr-1" /> Change
              </Button>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                className="h-8 rounded-lg bg-black/60 text-white hover:bg-red-600 backdrop-blur-sm border-0 text-xs"
                onClick={() => onChange("")}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="w-full aspect-[16/9] flex flex-col items-center justify-center gap-2 text-muted-foreground hover:text-brand transition-colors"
          >
            <div className="h-12 w-12 rounded-xl bg-secondary/50 flex items-center justify-center">
              <ImageIcon className="h-6 w-6" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium">Click to upload cover image</p>
              <p className="text-xs text-muted-foreground mt-0.5">PNG, JPG, WEBP up to {maxSizeMB}MB</p>
            </div>
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
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
