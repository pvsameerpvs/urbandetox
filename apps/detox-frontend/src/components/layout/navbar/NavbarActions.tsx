import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface NavbarActionsProps {
  isLightMode: boolean;
  mobile?: boolean;
  onClick?: () => void;
}

export function NavbarActions({ isLightMode, mobile, onClick }: NavbarActionsProps) {
  const buttonClass = cn(
    "h-11 px-6 text-sm font-bold rounded-full transition-all duration-300 uppercase tracking-wide",
    isLightMode
      ? "border-border bg-transparent text-foreground hover:bg-secondary"
      : "border-white/40 bg-white/10 text-white hover:bg-white/20 hover:text-white backdrop-blur-sm"
  );

  if (mobile) {
    return (
      <div className="pt-4 border-t">
        <Button className="w-full bg-brand text-brand-foreground hover:bg-brand/90 h-12 font-bold uppercase tracking-wide" asChild>
          <Link href="/login" onClick={onClick}>
            Log In
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="hidden md:flex items-center gap-4">
      <Button variant="outline" className={buttonClass} asChild>
        <Link href="/login">Log In</Link>
      </Button>
    </div>
  );
}
