import type { Metadata } from "next";
import {
  DEFAULT_DESCRIPTION,
  DEFAULT_OG_IMAGE,
  DEFAULT_TITLE,
  METADATA_BASE,
  OG_BASE,
  SITE_NAME,
} from "@/lib/metadata";
import { Geist_Mono } from "next/font/google";
import { redHatDisplay, superbusyHeading, superbusyCta } from "@/lib/fonts";
import "./globals.css";
import { ConditionalNavbar } from "@/components/layout/ConditionalNavbar";
import { ConditionalFooter } from "@/components/layout/ConditionalFooter";
import { ClientProviders } from "@/components/providers";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildOrganizationNode, buildWebSiteNode } from "@/lib/seo/brand";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  /**
   * Required for every relative metadata URL to resolve. Without it canonicals
   * stayed relative and relative og:image paths could not be built at all, and
   * on Railway there is no VERCEL_URL for Next to infer a base from. Shares one
   * constant with sitemap.ts and robots.ts so the four cannot disagree about
   * which host is real.
   */
  metadataBase: METADATA_BASE,
  title: {
    default: DEFAULT_TITLE,
    /**
     * Pages pass a plain string and get the brand appended. A value that
     * already carries the brand is marked absolute by dbTitle, so nothing is
     * double-branded.
     */
    template: `%s | ${SITE_NAME}`,
  },
  description: DEFAULT_DESCRIPTION,
  // Root canonical. Page-level routeSeo overrides this per route.
  alternates: { canonical: "/" },
  openGraph: {
    ...OG_BASE,
    type: "website",
    url: "/",
    images: [DEFAULT_OG_IMAGE],
  },
  twitter: { card: "summary_large_image" },
  icons: {
    icon: "/fevic.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${redHatDisplay.variable} ${superbusyHeading.variable} ${superbusyCta.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <JsonLd id="ld-brand" nodes={[buildOrganizationNode(), buildWebSiteNode()]} />
        <ClientProviders>
          <ConditionalNavbar />
          <main className="flex-1">{children}</main>
          <ConditionalFooter />
        </ClientProviders>
      </body>
    </html>
  );
}
