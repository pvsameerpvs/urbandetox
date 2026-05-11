"use client";

import { useFormContext } from "react-hook-form";
import { Input } from "@urbandetox/ui";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

interface NumberFieldProps {
  name: string;
  label: string;
  min?: number;
  fallback?: number;
  className?: string;
}

export function NumberField({ name, label, min = 0, fallback = 0, className = "h-11 rounded-xl" }: NumberFieldProps) {
  const { control } = useFormContext();
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input
              type="number"
              min={min}
              className={className}
              {...field}
              onChange={(e) => field.onChange(parseInt(e.target.value) || fallback)}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
