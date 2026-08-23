import Link from "next/link";
import Image from "next/image";
import { FooterSocialRow } from "./FooterSocialRow";
import type { SiteSettings } from "@urbandetox/utils";

interface FooterBrandColumnProps {
  settings?: SiteSettings;
}

export function FooterBrandColumn({ settings }: FooterBrandColumnProps) {
  return (
    <div className="sm:col-span-2 lg:col-span-2">
      <Link href="/" className="inline-block mb-5">
        <Image
          src="/log-detox.png"
          alt="Urban Detox"
          width={160}
          height={48}
          className="h-12 w-auto object-contain"
        />
      </Link>
      <p className="text-sm text-footer-foreground/75 leading-relaxed max-w-xs mb-6">
        Disconnect from routine. Step into curated offbeat escapes designed for real reset.
      </p>
      <FooterSocialRow settings={settings} />
    </div>
  );
}
