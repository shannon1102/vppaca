import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/seo/metadata";

export default function robots(): MetadataRoute.Robots {
  const base = siteUrl();
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin",
        "/admin/",
        "/gio-hang",
        "/thanh-toan",
        "/dat-hang-thanh-cong/",
      ],
    },
    sitemap: `${base}/sitemap.xml`,
  };
}
