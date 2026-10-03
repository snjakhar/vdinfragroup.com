import type { Metadata, Viewport } from "next";
import { preconnect } from "react-dom";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import { site } from "@content/site";
import { seo } from "@content/seo";
import { GoogleAnalytics } from "@/lib/analytics/google-analytics";
import { MEDIA_BASE_URL } from "@/lib/images/presets";
import "@/styles/globals.css";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const sans = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: seo.defaultTitle, template: seo.titleTemplate },
  description: seo.defaultDescription,
  keywords: seo.keywords,
  applicationName: site.name,
  icons: { icon: [{ url: "/favicon.ico", sizes: "48x48" }, { url: "/brand/icon-192.png", sizes: "192x192", type: "image/png" }, { url: "/brand/favicon.svg", type: "image/svg+xml" }], apple: "/brand/apple-touch-icon.png" },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#f7f4ee",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  // Open the image connection early: R2 images, plus the placeholder host until real photos are uploaded.
  preconnect(MEDIA_BASE_URL);
  preconnect("https://images.unsplash.com");
  return (
    <html lang="en-IN" className={`${display.variable} ${sans.variable}`} suppressHydrationWarning>
      <body>
        {/* Marks JS as available before first paint, so scroll reveals never hide content for no-JS visitors. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
        {children}
        <GoogleAnalytics />
      </body>
    </html>
  );
}
