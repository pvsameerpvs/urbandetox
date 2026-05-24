import { Badge } from "@urbandetox/ui";
import { ShieldCheck } from "lucide-react";

export function RoleBadge({ role }: { role: string }) {
  if (role === "admin") {
    return (
      <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 text-[10px]">
        <ShieldCheck className="h-3 w-3 mr-1" /> Admin
      </Badge>
    );
  }
  return (
    <Badge className="bg-slate-100 text-slate-600 hover:bg-slate-100 text-[10px]">
      User
    </Badge>
  );
}
