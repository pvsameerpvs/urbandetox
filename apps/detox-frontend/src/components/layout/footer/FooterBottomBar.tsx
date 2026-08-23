import Link from "next/link";
import { MapPin } from "lucide-react";

export function FooterBottomBar() {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-6 border-t border-footer-foreground/10 text-xs text-footer-foreground/75">
      <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
        <p>© {new Date().getFullYear()} Urban Detox. All rights reserved.</p>
        <span className="hidden sm:inline">·</span>
        <div className="flex items-center gap-2 text-footer-foreground/75">
          <MapPin className="h-3 w-3" />
          <span>Bangalore, India</span>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <Link href="/terms" className="hover:text-footer-foreground transition-colors">
          Terms
        </Link>
        <Link href="/terms#privacy-policy" className="hover:text-footer-foreground transition-colors">
          Privacy
        </Link>
        <Link
          href="/terms#cancellation-and-refund-policy"
          className="hover:text-footer-foreground transition-colors"
        >
          Cancellation
        </Link>
      </div>
    </div>
  );
}
