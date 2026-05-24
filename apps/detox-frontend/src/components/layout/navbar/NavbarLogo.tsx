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
        className="h-28 w-28 sm:h-32 sm:w-32 lg:h-36 lg:w-36 object-contain"
        priority
      />
    </Link>
  );
}
