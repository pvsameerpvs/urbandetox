import Link from "next/link";
import Image from "next/image";
import { cn } from "@urbandetox/utils";

interface NavbarLogoProps {
  isLightMode: boolean;
  onClick?: () => void;
  className?: string;
}

export function NavbarLogo({ isLightMode, onClick, className }: NavbarLogoProps) {
  return (
    <Link href="/" className={cn("flex items-center shrink-0", className)} onClick={onClick}>
      {/* The wordmark is 11875x1784 (6.66:1). Sizing by height with width:auto
          keeps its true aspect ratio; a square box letterboxed it to ~112x17px. */}
      <Image
        src={isLightMode ? "/log-detox.png" : "/log-detox-white.png"}
        alt="Urban Detox"
        width={1332}
        height={200}
        // Without `sizes` Next derives the srcset from the declared 1332px
        // width and ships a 1440px-wide file for a 32px-tall wordmark.
        sizes="(min-width: 1024px) 267px, (min-width: 640px) 240px, 213px"
        className="h-8 w-auto sm:h-9 lg:h-10 object-contain"
        priority
      />
    </Link>
  );
}
