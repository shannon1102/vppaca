export function formatVnd(amount: number): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function effectivePrice(price: number, salePrice: number | null): number {
  return salePrice != null && salePrice > 0 && salePrice < price ? salePrice : price;
}

/**
 * Chuyển tiêu đề tiếng Việt → slug URL an toàn (SEO-friendly).
 * Ví dụ: "Cách đo huyết áp" → "cach-do-huyet-ap"
 *
 * SEO: dùng slug text (từ tiêu đề), không dùng id trong URL.
 * Id chỉ dùng nội bộ DB; slug giúp Google đọc keyword trong URL.
 */
export function slugify(input: string, fallback = ""): string {
  const slug = input
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[đĐ]/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/(^-|-$)/g, "");

  if (slug) return slug;
  if (fallback) return slugify(fallback);
  return "";
}

/** Slug cuối cùng khi lưu: ưu tiên slug nhập → tiêu đề → id. */
export function resolveSlug(
  rawSlug: string,
  fallbackTitle: string,
  id?: string,
): string {
  return (
    slugify(rawSlug) ||
    slugify(fallbackTitle) ||
    (id ? slugify(id.replace(/^[^a-z0-9]+/i, "")) : "") ||
    "item"
  );
}

/**
 * Auto slug từ tên. Khi sửa: giữ slug cũ (ổn định SEO).
 * Khi tạo / trùng: thêm -2, -3, ...
 */
export function ensureUniqueSlug(opts: {
  title: string;
  id?: string;
  current?: string | null;
  taken: Iterable<string>;
}): string {
  if (opts.current?.trim()) return slugify(opts.current);

  const base = resolveSlug("", opts.title, opts.id);
  const taken = new Set(
    [...opts.taken].map((s) => slugify(s)).filter(Boolean),
  );
  if (!taken.has(base)) return base;

  let n = 2;
  while (taken.has(`${base}-${n}`)) n += 1;
  return `${base}-${n}`;
}

/** Sinh SKU từ tên + id, ví dụ MED-MAYDO-P01A2B */
export function generateSku(name: string, id: string): string {
  const parts = slugify(name).split("-").filter(Boolean);
  const code =
    parts
      .slice(0, 2)
      .map((p) => p.slice(0, 3).toUpperCase())
      .join("")
      .slice(0, 6) || "PRD";
  const tail =
    id.replace(/[^a-zA-Z0-9]/g, "").slice(-6).toUpperCase() ||
    Date.now().toString(36).toUpperCase();
  return `MED-${code}-${tail}`;
}

/**
 * Auto SKU. Khi sửa: giữ SKU cũ.
 * Khi tạo / trùng: thêm hậu tố -2, -3, ...
 */
export function ensureUniqueSku(opts: {
  name: string;
  id: string;
  current?: string | null;
  taken: Iterable<string>;
}): string {
  if (opts.current?.trim()) return opts.current.trim();

  const base = generateSku(opts.name, opts.id);
  const taken = new Set(
    [...opts.taken].map((s) => s.trim()).filter(Boolean),
  );
  if (!taken.has(base)) return base;

  let n = 2;
  while (taken.has(`${base}-${n}`)) n += 1;
  return `${base}-${n}`;
}

export function orderCode(): string {
  const t = Date.now().toString(36).toUpperCase();
  const r = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `DH${t}${r}`;
}

export function transferContent(template: string, code: string): string {
  return template.replace("{code}", code);
}

/** Strip HTML tags for plain-text display (legacy rich-text descriptions). */
export function stripHtml(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
