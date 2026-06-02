import Link from "next/link";
import { MapPin } from "lucide-react";

export function FooterBottomBar() {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-6 border-t border-footer-foreground/10 text-xs text-footer-foreground/40">
      <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
        <p>© {new Date().getFullYear()} Urban Detox. All rights reserved.</p>
        <span className="hidden sm:inline">·</span>
        <div className="flex items-center gap-2 text-footer-foreground/50">
          <MapPin className="h-3 w-3" />
          <span>Bangalore, India</span>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <Link href="#" className="hover:text-footer-foreground/60 transition-colors">
          Terms
        </Link>
        <Link href="#" className="hover:text-footer-foreground/60 transition-colors">
          Privacy
        </Link>
      </div>
    </div>
  );
}
