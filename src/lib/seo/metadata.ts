import type { Metadata } from "next";
import type { SiteSettings } from "@/lib/types";

export const CANONICAL_SITE_URL = "https://thietbiytetamduc.vn";

export function siteUrl(): string {
  const env = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (env) return env.replace(/\/$/, "");
  if (process.env.NODE_ENV === "production") return CANONICAL_SITE_URL;
  return "http://localhost:3000";
}

export function defaultOgImage(settings: SiteSettings): string {
  if (settings.logo_url?.startsWith("http") || settings.logo_url?.startsWith("/")) {
    return settings.logo_url;
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
}): Metadata {
  const image = opts.image ?? "/products/p-01.jpg";
  const robots = opts.noindex
    ? { index: false as const, follow: false as const }
    : { index: true as const, follow: true as const };

  return {
    title: opts.title,
    description: opts.description,
    alternates: canonicalPath(opts.path),
    robots,
    openGraph: {
      title: opts.title,
      description: opts.description,
      url: opts.path,
      type: opts.openGraphType ?? "website",
      locale: "vi_VN",
      images: [{ url: image }],
    },
    twitter: {
      card: "summary_large_image",
      title: opts.title,
      description: opts.description,
      images: [image],
    },
  };
}

export function rootMetadata(settings: SiteSettings): Metadata {
  const title = `${settings.shop_name} — Thiết bị y tế`;
  const image = defaultOgImage(settings);
  return {
    metadataBase: new URL(siteUrl()),
    title: {
      default: title,
      template: `%s | ${settings.shop_name}`,
    },
    description: settings.tagline,
    icons: { icon: settings.favicon_url },
    robots: { index: true, follow: true },
    openGraph: {
      title: settings.shop_name,
      description: settings.tagline,
      url: "/",
      siteName: settings.shop_name,
      locale: "vi_VN",
      type: "website",
      images: [{ url: image, alt: settings.shop_name }],
    },
    twitter: {
      card: "summary_large_image",
      title: settings.shop_name,
      description: settings.tagline,
      images: [image],
    },
  };
}
