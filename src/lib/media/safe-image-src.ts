const FALLBACK = "/seed/product-01.svg";

const ALLOWED_HOSTS = new Set(["images.unsplash.com", "images.pexels.com", "localhost"]);

/** Avoid next/image throwing on empty or unconfigured remote hosts. */
export function catalogImageSrc(src?: string | null, fallback = FALLBACK): string {
  if (!src?.trim()) return fallback;
  if (src.startsWith("/")) return src;
  try {
    const { hostname, protocol } = new URL(src);
    if (protocol !== "http:" && protocol !== "https:") return fallback;
    if (hostname.endsWith(".supabase.co") || ALLOWED_HOSTS.has(hostname)) return src;
  } catch {
    return fallback;
  }
  return fallback;
}
