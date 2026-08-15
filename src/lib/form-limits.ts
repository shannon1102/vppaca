/** Shared admin form limits — keep under Vercel ~4.5MB request body. */

export const FORM_LIMITS = {
  /** Next/Vercel practical ceiling for Server Action body */
  requestBodyBytes: 4 * 1024 * 1024,
  imageUploadBytes: 5 * 1024 * 1024,
  imageUploadLabel: "5MB",

  title: 200,
  name: 200,
  excerpt: 500,
  description: 2000,
  /** Rich HTML without base64 images */
  richHtml: 400_000,
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
  return `${formatCharLimit(FORM_LIMITS.richHtml)} · ảnh chèn qua nút Image / dán — không gửi base64 trong form`;
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
