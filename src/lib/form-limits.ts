/** Shared admin form limits — keep under Vercel ~4.5MB request body. */

export const FORM_LIMITS = {
  /** Next/Vercel practical ceiling for Server Action body (matches next.config) */
  requestBodyBytes: Math.floor(4.5 * 1024 * 1024),
  imageUploadBytes: 5 * 1024 * 1024,
  imageUploadLabel: "5MB",

  title: 200,
  name: 200,
  excerpt: 500,
  description: 2000,
  /** Server-side max persisted HTML length (Postgres text + transport guard) */
  richHtml: 4_000_000,
  /** Rich editor plain-text limit shown to admins (excludes HTML tags and images) */
  richHtmlPlain: 100_000,
  tags: 120,
  seoTitle: 70,
  seoDescription: 160,
  url: 500,
  shopName: 120,
  tagline: 200,
  phone: 30,
  email: 120,
  address: 300,
  color: 20,
  bankName: 80,
  bankAccount: 40,
  bankHolder: 80,
  transferTemplate: 80,
  categoryId: 80,
  categoryDescription: 500,
  specKey: 80,
  specValue: 200,
} as const;

export function formatCharLimit(max: number): string {
  return `Tối đa ${max.toLocaleString("vi-VN")} ký tự`;
}

export function formatImageLimit(): string {
  return `Ảnh mỗi file ≤ ${FORM_LIMITS.imageUploadLabel} (JPG/PNG/GIF/WEBP, tự nén khi tải lên)`;
}

export function formatRichHtmlLimit(): string {
  return `${formatCharLimit(FORM_LIMITS.richHtmlPlain)} nội dung (không tính ảnh/HTML) · ảnh chèn qua nút Image / dán`;
}

/** Plain-text length for rich editor UI — strips tags/entities, ignores <img>. */
export function countRichTextPlain(html: string): number {
  if (!html.trim()) return 0;

  const withoutImages = html.replace(/<img\b[^>]*>/gi, "");
  const text = withoutImages
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|div|h[1-6]|li|tr|blockquote)>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/\u00a0/g, " ");

  return text.replace(/\n+$/, "").length;
}

/** Strip inline base64 images from HTML (last-resort server/client guard). */
export function stripDataImages(html: string): string {
  return html
    .replace(/<img\b[^>]*\ssrc=["']data:image\/[^"']+["'][^>]*>/gi, "")
    .replace(/\ssrc=["']data:image\/[^"']+["']/gi, ' src=""');
}

export function hasDataImages(html: string): boolean {
  return /data:image\//i.test(html);
}

export function clampText(value: string, max: number): string {
  return value.length <= max ? value : value.slice(0, max);
}
