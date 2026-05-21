"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Button } from "@urbandetox/ui";
import { Upload, X } from "lucide-react";

interface ImageUploadInlineProps {
  value: string | undefined;
  onChange: (value: string) => void;
}

export function ImageUploadInline({ value, onChange }: ImageUploadInlineProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFile = (file: File) => {
    setError(null);
    if (file.size > 5 * 1024 * 1024) {
      setError("Max 5MB.");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => onChange(reader.result as string);
    reader.readAsDataURL(file);
  };

  const hasImage = value && (value.startsWith("http") || value.startsWith("data:image"));

  if (hasImage) {
    return (
      <div className="flex items-center gap-2">
        <div className="relative w-16 h-12 rounded-lg overflow-hidden border border-border/40 shrink-0">
          <Image src={value!} alt="Day image" fill sizes="64px" className="object-cover" unoptimized />
        </div>
        <div className="flex gap-1">
          <Button type="button" variant="outline" size="icon" className="h-8 w-8" onClick={() => inputRef.current?.click()}>
            <Upload className="h-3.5 w-3.5" />
          </Button>
          <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-red-500" onClick={() => onChange("")}>
            <X className="h-3.5 w-3.5" />
          </Button>
        </div>
        <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ""; }} />
        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Button type="button" variant="outline" size="sm" className="rounded-lg h-8 text-xs" onClick={() => inputRef.current?.click()}>
        <Upload className="h-3.5 w-3.5 mr-1" /> Image
      </Button>
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ""; }} />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
