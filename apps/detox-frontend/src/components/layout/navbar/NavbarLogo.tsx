import Link from "next/link";
import { Leaf } from "lucide-react";

interface NavbarLogoProps {
  onClick?: () => void;
}

export function NavbarLogo({ onClick }: NavbarLogoProps) {
  return (
    <Link
      href="/"
      className="flex items-center gap-2 text-brand"
      onClick={onClick}
    >
      <Leaf className="h-6 w-6" />
      <span className="text-lg font-semibold tracking-tight">Urban Detox</span>
    </Link>
  );
}
