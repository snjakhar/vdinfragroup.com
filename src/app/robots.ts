import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo/metadata";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  // Preview deployments are kept out of search via the X-Robots-Tag header in public/_headers.
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/api/", "/thank-you"] },
    sitemap: absoluteUrl("/sitemap.xml"),
    host: absoluteUrl("/"),
  };
}
