export interface NavLink {
  href: string;
  label: string;
}

export const NAV_LINKS: NavLink[] = [
  { href: "/detox", label: "Explore Detox" },
  { href: "/guide", label: "Guide" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];
