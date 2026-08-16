/** Hard caps for catalog size on Supabase free / white-label handoff. */

export const CATALOG_LIMITS = {
  maxProducts: 30,
  maxArticles: 50,
} as const;

export function productLimitMessage(): string {
  return `Bạn đã đăng đến giới hạn ${CATALOG_LIMITS.maxProducts} sản phẩm. Vui lòng xóa bớt để thêm mới.`;
}

export function articleLimitMessage(): string {
  return `Bạn đã đăng đến giới hạn ${CATALOG_LIMITS.maxArticles} bài viết sức khỏe. Vui lòng xóa bớt để thêm mới.`;
}

export function isAtProductLimit(count: number): boolean {
  return count >= CATALOG_LIMITS.maxProducts;
}

export function isAtArticleLimit(count: number): boolean {
  return count >= CATALOG_LIMITS.maxArticles;
}

export function formatCatalogUsage(count: number, max: number): string {
  return `${count}/${max}`;
}
