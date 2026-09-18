import { ACA_LOGO_URL, resolveLogoUrl } from "@/lib/brand-logo";
import type { SiteSettings } from "@/lib/types";
import { siteUrl } from "@/lib/seo/metadata";

export function absoluteUrl(path: string): string {
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  const base = siteUrl();
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

export function absoluteImageUrls(images: string[]): string[] {
  return images.map(absoluteUrl);
}

export function postalAddress(settings: SiteSettings) {
  return {
    "@type": "PostalAddress" as const,
    streetAddress: settings.address,
    addressLocality: "Hà Nội",
    addressRegion: "Hà Nội",
    addressCountry: "VN",
  };
}

export function organizationJsonLd(settings: SiteSettings) {
  const base = siteUrl();
  const logo = absoluteUrl(resolveLogoUrl(settings.logo_url || ACA_LOGO_URL));
  return {
    "@context": "https://schema.org",
    "@type": ["Organization", "LocalBusiness"],
    name: settings.shop_name,
    url: base,
    telephone: settings.phone,
    email: settings.email,
    address: postalAddress(settings),
    image: logo,
    logo: {
      "@type": "ImageObject",
      url: logo,
    },
  };
}

export function websiteJsonLd(settings: SiteSettings) {
  const base = siteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: settings.shop_name,
    url: base,
    potentialAction: {
      "@type": "SearchAction",
      target: `${base}/san-pham?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}
