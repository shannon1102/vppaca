const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED = new Set([
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
]);

export function validateImageFile(file: File) {
  if (!ALLOWED.has(file.type)) {
    throw new Error("Chỉ hỗ trợ ảnh JPG, PNG, GIF, WEBP.");
  }
  if (file.size > MAX_BYTES) {
    throw new Error("Ảnh tối đa 5MB.");
  }
}

export function extFromMime(mime: string): string {
  switch (mime) {
    case "image/jpeg":
      return "jpg";
    case "image/png":
      return "png";
    case "image/gif":
      return "gif";
    case "image/webp":
      return "webp";
    default:
      return "bin";
  }
}

export function safeFilename(name: string): string {
  return name.replace(/[^\w.\-() ]+/g, "_").slice(0, 120);
}

/** YYYYMMDD prefix for uploaded files (traceability). */
export function uploadDatePrefix(date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}${m}${d}`;
}

const MANAGED_KEY_RE =
  /^(\d{8}-)?media-\d+-[a-z0-9]+\.(jpg|jpeg|png|gif|webp)$/i;

/** Extract storage key from a managed upload URL or path. */
export function storageKeyFromUrl(src: string): string | null {
  const url = normalizeImageSrc(src);
  if (!url) return null;

  if (url.startsWith("/uploads/")) {
    const key = url.slice("/uploads/".length).split("?")[0];
    return MANAGED_KEY_RE.test(key) ? key : null;
  }

  const match = url.match(/\/storage\/v1\/object\/public\/media\/([^?#]+)/i);
  if (match) {
    const key = decodeURIComponent(match[1]);
    return MANAGED_KEY_RE.test(key) ? key : null;
  }

  return MANAGED_KEY_RE.test(url) ? url : null;
}

const IMG_SRC_RE = /<img\b[^>]*\ssrc=["']([^"']+)["']/gi;

/** Collect managed upload URLs referenced in rich HTML. */
export function extractManagedImageUrlsFromHtml(html: string): string[] {
  const urls = new Set<string>();
  for (const match of html.matchAll(IMG_SRC_RE)) {
    const key = storageKeyFromUrl(match[1]);
    if (key) urls.add(normalizeImageSrc(match[1]));
  }
  return [...urls];
}

/** Unwrap nested Next.js image optimizer URLs from copy-paste. */
export function normalizeImageSrc(src: string): string {
  let url = src.trim();
  if (!url) return url;

  for (let i = 0; i < 8; i++) {
    const rel = url.match(/\/_next\/image\?url=([^&]+)/i);
    if (rel) {
      url = decodeURIComponent(rel[1]);
      continue;
    }

    try {
      const parsed = new URL(url);
      const inner = parsed.searchParams.get("url");
      if (parsed.pathname.includes("_next/image") && inner) {
        url = decodeURIComponent(inner);
        continue;
      }
      // absolute URL → relative path for same-site static assets
      if (
        parsed.pathname.startsWith("/products/") ||
        parsed.pathname.startsWith("/uploads/") ||
        parsed.pathname.startsWith("/seed/")
      ) {
        return parsed.pathname;
      }
    } catch {
      /* relative path — ok */
    }

    if (url.includes("%2F") || url.includes("%3A")) {
      try {
        const decoded = decodeURIComponent(url);
        if (decoded !== url) {
          url = decoded;
          continue;
        }
      } catch {
        /* ignore */
      }
    }

    break;
  }

  return url;
}

/** Replace broken / nested img src in HTML before render. */
export function normalizeRichHtml(html: string): string {
  return html.replace(
    /(<img\b[^>]*\ssrc=["'])([^"']+)(["'][^>]*>)/gi,
    (_m, pre, src, post) => `${pre}${normalizeImageSrc(src)}${post}`,
  );
}
