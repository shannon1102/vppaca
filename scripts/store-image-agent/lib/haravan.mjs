/**
 * Helpers for Haravan / Hstatic storefronts (e.g. thienlong.vn).
 * Public JSON: GET /collections/{handle}/products.json?limit=50&page=N
 */

const DEFAULT_PAGE_SIZE = 50;
const DEFAULT_DELAY_MS = 400;

export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function normalizeAssetUrl(src) {
  if (!src || typeof src !== "string") return null;
  if (src.startsWith("//")) return `https:${src}`;
  if (src.startsWith("http://")) return src.replace(/^http:/, "https:");
  return src;
}

export function productPageUrl(baseUrl, handle) {
  const base = baseUrl.replace(/\/$/, "");
  return `${base}/products/${handle}`;
}

export function collectionProductsUrl(baseUrl, handle, page, limit = DEFAULT_PAGE_SIZE) {
  const base = baseUrl.replace(/\/$/, "");
  const u = new URL(`${base}/collections/${encodeURIComponent(handle)}/products.json`);
  u.searchParams.set("limit", String(limit));
  u.searchParams.set("page", String(page));
  return u.toString();
}

/**
 * @param {object} opts
 * @param {string} opts.baseUrl
 * @param {string} opts.collectionHandle
 * @param {number} [opts.maxPages] 0 = unlimited
 * @param {number} [opts.pageSize]
 * @param {number} [opts.delayMs]
 * @param {(msg: string) => void} [opts.log]
 */
export async function fetchAllCollectionProducts(opts) {
  const {
    baseUrl,
    collectionHandle,
    maxPages = 0,
    pageSize = DEFAULT_PAGE_SIZE,
    delayMs = DEFAULT_DELAY_MS,
    log = () => {},
  } = opts;

  const products = [];
  let page = 1;

  while (true) {
    if (maxPages > 0 && page > maxPages) break;

    const url = collectionProductsUrl(baseUrl, collectionHandle, page, pageSize);
    log(`GET ${url}`);

    const res = await fetch(url, {
      headers: {
        Accept: "application/json",
        "User-Agent": "vppaca-store-image-agent/1.0 (+https://vppaca.vn; catalog reference)",
      },
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status} for ${url}`);
    }

    const data = await res.json();
    const batch = Array.isArray(data?.products) ? data.products : [];
    if (batch.length === 0) break;

    products.push(...batch);
    log(`  page ${page}: ${batch.length} products (total ${products.length})`);

    if (batch.length < pageSize) break;
    page += 1;
    if (delayMs > 0) await sleep(delayMs);
  }

  return products;
}

export function pickProductImages(product, { allImages = false } = {}) {
  const images = Array.isArray(product?.images) ? product.images : [];
  const sorted = [...images].sort((a, b) => (a.position ?? 0) - (b.position ?? 0));
  const picked = allImages ? sorted : sorted.slice(0, 1);
  return picked
    .map((img) => normalizeAssetUrl(img.src))
    .filter(Boolean);
}

export function safeFilenamePart(s) {
  return String(s)
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase()
    .slice(0, 120);
}

export function extensionFromUrl(url) {
  try {
    const pathname = new URL(url).pathname;
    const ext = pathname.split(".").pop()?.toLowerCase();
    if (ext && ["jpg", "jpeg", "png", "webp", "gif"].includes(ext)) {
      return ext === "jpeg" ? "jpg" : ext;
    }
  } catch {
    /* ignore */
  }
  return "jpg";
}
