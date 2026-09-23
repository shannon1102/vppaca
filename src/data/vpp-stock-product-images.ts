/**
 * Ảnh sản phẩm do ACA cung cấp (public/products/stock/, ford-mau/).
 * Cùng brand / loại khác định lượng → một ảnh chung.
 */

const S = "/products/stock";
const FORD = "/products/ford-mau/ford-mau-colored-papers.jpg";
const BIA_MAU_A3 = "/products/ford-mau/bia-mau-a3-colored-sheets.png";

export const STOCK_IMAGES = {
  kingStarBiaCong: `${S}/king-star-bia-cong.jpg`,
  biaNhuaEpPlastic: `${S}/bia-nhua-ep-plastic.jpg`,
  biaKiengTrong: `${S}/bia-kieng-trong.jpg`,
  biaMauA3: BIA_MAU_A3,
  giayA1: `${S}/giay-a1-rolled-sheets.png`,
  fordMau: FORD,
  giayLienTuc: `${S}/giay-lien-tuc-lien-son.webp`,
  butTl027: `${S}/but-thien-long-tl-027.webp`,
  temGhtk5050: `${S}/tem-in-don-ghtk-50x50.jpg`,
} as const;

export function resolveVppStockImages(product: {
  slug: string;
  name?: string;
  category_id?: string;
}): string[] | null {
  const slug = product.slug;
  const name = product.name ?? "";
  const cat = product.category_id ?? "";

  if (/tl-027|thien-long-027/i.test(slug) || /TL-027/i.test(name)) {
    return [STOCK_IMAGES.butTl027];
  }

  if (
    slug === "bia-cong-7cm-a4" ||
    /king.?star/i.test(name) ||
    (/bìa còng|bia cong/i.test(name) && cat === "cat-bia")
  ) {
    return [STOCK_IMAGES.kingStarBiaCong];
  }

  if (slug.startsWith("giay-ep-plastic-") || /ép plastic|ep plastic/i.test(name)) {
    return [STOCK_IMAGES.biaNhuaEpPlastic];
  }

  if (
    cat === "cat-giay-bia-mau" &&
    /a3/i.test(`${slug} ${name}`) &&
    (/^bia-/.test(slug) || /bìa|bia /i.test(name))
  ) {
    return [STOCK_IMAGES.biaMauA3];
  }

  if (/(?:^|[-_])a1(?:[-_]|$)/i.test(slug) || /\bA1\b/i.test(name)) {
    return [STOCK_IMAGES.giayA1];
  }

  if (slug.startsWith("decal-") || /decal thường|giấy decal trong/i.test(name)) {
    return [STOCK_IMAGES.biaKiengTrong];
  }

  if (cat === "cat-giay-lien-tuc" || /liên tục|lien tuc|liên sơn/i.test(name)) {
    return [STOCK_IMAGES.giayLienTuc];
  }

  if (cat === "cat-giay-nhiet" || /giấy in nhiệt|giay in nhiet|giấy fax nhiệt/i.test(name)) {
    return [STOCK_IMAGES.temGhtk5050];
  }

  if (
    slug === "giay-in-tem-nhiet-50x50" ||
    (/50\s*[×x]\s*50/i.test(name) && /tem|nhiet|nhiệt|GHTK/i.test(name))
  ) {
    return [STOCK_IMAGES.temGhtk5050];
  }

  if (/ford/i.test(name) || slug.includes("ford-mau")) {
    return [STOCK_IMAGES.fordMau];
  }

  return null;
}
