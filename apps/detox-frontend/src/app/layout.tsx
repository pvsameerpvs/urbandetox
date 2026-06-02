import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import { redHatDisplay, superbusyHeading, superbusyCta } from "@/lib/fonts";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import { ConditionalFooter } from "@/components/layout/ConditionalFooter";
import { ClientProviders } from "@/components/providers";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Urban Detox — Disconnect from routine. Step into your next detox.",
  description:
    "Curated offbeat escapes for real reset. Small-group detox trips to Kodaikanal, North Kerala, Gokarna, and beyond.",
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
        <ClientProviders>
          <Navbar />
          <main className="flex-1">{children}</main>
          <ConditionalFooter />
        </ClientProviders>
      </body>
    </html>
  );
}
