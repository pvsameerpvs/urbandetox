import { Red_Hat_Display } from "next/font/google";
import localFont from "next/font/local";

export const redHatDisplay = Red_Hat_Display({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const superbusyHeading = localFont({
  src: "../../public/SuperbusyActivity-Regular.woff",
  weight: "400",
  variable: "--font-heading",
  display: "swap",
});

export const superbusyCta = localFont({
  src: "../../public/Superbusy Activity Text.woff",
  weight: "400",
  variable: "--font-cta",
  display: "swap",
});
