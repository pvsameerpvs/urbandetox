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
      <Image
        src={isLightMode ? "/log-detox.png" : "/log-detox-white.png"}
        alt="Urban Detox"
        width={160}
        height={160}
        className="h-20 w-20 sm:h-24 sm:w-24 lg:h-28 lg:w-28 object-contain"
        priority
      />
    </Link>
  );
}
