export interface NavLink {
  href: string;
  label: string;
}

export const NAV_LINKS: NavLink[] = [
  { href: "/detox", label: "Explore Detox" },
  // The client asked for international trips to have a face rather than being
  // buried in the local list, so they get their own top-level entry.
  { href: "/detox?scope=international", label: "International" },
  { href: "/guide", label: "Travel Guide" },
  // Distinct from Travel Guide, which is articles. This one hires a person.
  // { href: "/local-guides", label: "Hire a Guide" },
  // { href: "/about", label: "About" },
  // { href: "/contact", label: "Contact" },
];
