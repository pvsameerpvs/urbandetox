"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Button } from "@urbandetox/ui";
import { Upload, X, ImageIcon } from "lucide-react";

interface ImageUploadProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  maxSizeMB?: number;
}

export function ImageUpload({ value, onChange, label = "Cover Image", maxSizeMB = 1 }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFile = (file: File) => {
    setError(null);
    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`Image too large. Max ${maxSizeMB}MB.`);
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      onChange(result);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      handleFile(file);
    }
  };

  const isValidUrl = value && (value.startsWith("http") || value.startsWith("data:image"));

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label}</label>
      {isValidUrl ? (
        <div className="relative rounded-xl overflow-hidden border border-border/40 bg-secondary/20">
          <div className="relative w-full h-40">
            <Image src={value} alt="Preview" fill sizes="400px" className="object-cover" unoptimized />
          </div>
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute top-2 right-2 h-7 w-7 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ) : (
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border/60 bg-secondary/10 hover:bg-secondary/20 transition-colors cursor-pointer h-40"
        >
          <div className="h-10 w-10 rounded-full bg-secondary/50 flex items-center justify-center">
            <ImageIcon className="h-5 w-5 text-muted-foreground" />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-foreground">Click to upload</p>
            <p className="text-xs text-muted-foreground mt-0.5">or drag and drop</p>
          </div>
          <p className="text-[10px] text-muted-foreground">PNG, JPG up to {maxSizeMB}MB</p>
        </div>
      )}
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
      {isValidUrl && (
        <Button type="button" variant="outline" size="sm" className="rounded-lg h-8 text-xs" onClick={() => inputRef.current?.click()}>
          <Upload className="h-3.5 w-3.5 mr-1.5" /> Change Image
        </Button>
      )}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
