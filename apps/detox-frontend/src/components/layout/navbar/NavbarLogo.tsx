import Link from "next/link";
import Image from "next/image";

interface NavbarLogoProps {
  onClick?: () => void;
}

export function NavbarLogo({ onClick }: NavbarLogoProps) {
  return (
    <Link
      href="/"
      className="flex items-center gap-2.5 text-brand"
      onClick={onClick}
    >
      <Image
        src="/log-detox.png"
        alt="Urban Detox"
        width={36}
        height={36}
        className="h-9 w-9 object-contain"
        priority
      />
      <span className="text-lg font-semibold tracking-tight hidden sm:block">Urban Detox</span>
    </Link>
  );
}
