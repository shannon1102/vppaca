/** SKU crawl không bán trên ACA — loại khỏi seed catalog. */
export function isExcludedPaperProduct(slug: string, name?: string): boolean {
  if (slug.startsWith("giay-decal-")) return true;
  if (slug.startsWith("nhan-tomy-")) return true;
  if (name && /^(Giấy Decal|Nhãn Tomy)/i.test(name.trim())) return true;
  return false;
}

export function isExcludedPaperSourceFolder(folder: string): boolean {
  return folder === "giay-decal";
}
