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
