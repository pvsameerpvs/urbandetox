import { cn } from "@urbandetox/utils";
import { LucideIcon } from "lucide-react";
import { Input, Label } from "@urbandetox/ui"

interface IconInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "className"> {
  label: string;
  icon: LucideIcon;
  onChange?: (value: string) => void;
  className?: string;
}

export function IconInput({ label, icon: Icon, onChange, className, ...props }: IconInputProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={props.id} className="text-sm font-semibold">{label}</Label>
      <div className="relative">
        <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        <Input
          {...props}
          onChange={(e) => onChange?.(e.target.value)}
          className={cn("h-12 pl-11 rounded-xl bg-secondary/40 border-0 text-sm focus-visible:ring-2 focus-visible:ring-brand/20", className)}
        />
      </div>
    </div>
  );
}
