import Link from "next/link";

interface FooterLink {
  label: string;
  href: string;
}

interface FooterLinkGroupProps {
  title: string;
  links: FooterLink[];
}

export function FooterLinkGroup({ title, links }: FooterLinkGroupProps) {
  return (
    <div>
      <h4 className="text-xs font-bold uppercase tracking-[0.15em] text-footer-foreground/75 mb-5">
        {title}
      </h4>
      <ul className="flex flex-col gap-3">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              className="text-sm text-footer-foreground/85 hover:text-footer-foreground transition-colors"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
