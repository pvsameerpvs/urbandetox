"use client";

import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { ImageUpload } from "@/components/shared/ImageUpload";
import { ImageIcon } from "lucide-react";
import type { Control } from "react-hook-form";
import type { DepartureFormData } from "./schema";

interface ImageFieldProps {
  control: Control<DepartureFormData>;
}

export function ImageField({ control }: ImageFieldProps) {
  return (
    <FormField
      control={control}
      name="image"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="flex items-center gap-2">
            <ImageIcon className="h-4 w-4 text-brand" /> Departure Photo
          </FormLabel>
          <FormControl>
            <ImageUpload
              value={field.value || ""}
              onChange={(url) => field.onChange(url || undefined)}
              label="Upload a departure cover image"
              folder="departures/covers"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
