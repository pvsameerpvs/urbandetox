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

interface TextFieldProps {
  name: string;
  label: string;
  placeholder?: string;
  type?: string;
  className?: string;
}

export function TextField({ name, label, placeholder, type = "text", className = "h-11 rounded-xl" }: TextFieldProps) {
  const { control } = useFormContext();
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input type={type} placeholder={placeholder} className={className} {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
