;
import { LucideIcon } from "lucide-react";
import { Separator } from "@urbandetox/ui"

interface ProfileSectionHeaderProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export function ProfileSectionHeader({ icon: Icon, title, description }: ProfileSectionHeaderProps) {
  return (
    <>
      <div className="flex items-center gap-3 mb-6">
        <div className="inline-flex items-center justify-center rounded-xl bg-brand/10 p-2.5">
          <Icon className="h-5 w-5 text-brand" />
        </div>
        <div>
          <h2 className="text-lg font-bold">{title}</h2>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      <Separator className="mb-6" />
    </>
  );
}
