import type { Metadata } from "next";
import { resolveLogoUrl } from "@/lib/brand-logo";
import type { SiteSettings } from "@/lib/types";

export const CANONICAL_SITE_URL = "https://thietbiytetamduc.vn";

export function siteUrl(): string {
  const env = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (env) return env.replace(/\/$/, "");
  if (process.env.NODE_ENV === "production") return CANONICAL_SITE_URL;
  return "http://localhost:3000";
}

export function defaultOgImage(settings: SiteSettings): string {
  const logo = resolveLogoUrl(settings.logo_url);
  if (logo.startsWith("http") || logo.startsWith("/")) {
    return logo;
  }
  return "/products/p-01.jpg";
}

export function canonicalPath(path: string): Metadata["alternates"] {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return { canonical: normalized };
}

export function noindexMetadata(title: string, description?: string): Metadata {
  return {
    title,
    description,
    robots: { index: false, follow: false },
  };
}

export function pageMetadata(opts: {
  title: string;
  description: string;
  path: string;
  image?: string;
  noindex?: boolean;
  openGraphType?: "website" | "article";
  keywords?: string[];
  publishedTime?: string;
  modifiedTime?: string;
  /** Skip canonical on pages like 404 where URL is dynamic */
  skipCanonical?: boolean;
}): Metadata {
  const image = opts.image ?? "/products/p-01.jpg";
  const robots = opts.noindex
    ? { index: false as const, follow: false as const }
    : { index: true as const, follow: true as const };

  return {
    title: opts.title,
    description: opts.description,
    keywords: opts.keywords,
    ...(opts.skipCanonical ? {} : { alternates: canonicalPath(opts.path) }),
    robots,
    openGraph: {
      title: opts.title,
      description: opts.description,
      url: opts.path,
      type: opts.openGraphType ?? "website",
      locale: "vi_VN",
      images: [{ url: image }],
      ...(opts.publishedTime && { publishedTime: opts.publishedTime }),
      ...(opts.modifiedTime && { modifiedTime: opts.modifiedTime }),
    },
    twitter: {
      card: "summary_large_image",
      title: opts.title,
      description: opts.description,
      images: [image],
    },
  };
}

/** Primary SEO phrases VPPACA */
export const SEO_KEYWORDS = [
  "vppaca",
  "văn phòng phẩm",
  "văn phòng phẩm online",
  "giấy A4",
  "bút bi",
  "mực in",
  "báo giá văn phòng phẩm",
  "văn phòng phẩm B2B",
  "ACA văn phòng phẩm",
] as const;

export function rootMetadata(settings: SiteSettings): Metadata {
  const title = `${settings.shop_name} — Văn phòng phẩm B2B & B2C`;
  const description =
    settings.tagline ||
    "Mua văn phòng phẩm chính hãng — giấy in, bút viết, mực in. Giá sỉ theo bậc, báo giá doanh nghiệp, giao hàng toàn quốc.";
  const image = defaultOgImage(settings);
  return {
    metadataBase: new URL(siteUrl()),
    title: {
      default: title,
      template: `%s | ${settings.shop_name}`,
    },
    description,
    keywords: [...SEO_KEYWORDS],
    icons: { icon: settings.favicon_url },
    robots: { index: true, follow: true },
    openGraph: {
      title: settings.shop_name,
      description,
      url: "/",
      siteName: settings.shop_name,
      locale: "vi_VN",
      type: "website",
      images: [{ url: image, alt: settings.shop_name }],
    },
    twitter: {
      card: "summary_large_image",
      title: settings.shop_name,
      description,
      images: [image],
    },
  };
}
