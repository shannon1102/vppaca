/**
 * Ảnh minh họa giấy Ford màu (Pexels — xem public/products/CREDITS.md).
 */

const F = "/products/ford-mau";

export const GIAY_FORD_CATEGORY_HERO = `${F}/colorful-papers-stacked.jpg`;

const SLUG_IMAGES: Record<string, string[]> = {
  "giay-ford-mau-a4-70": [
    `${F}/colorful-papers-stacked.jpg`,
    `${F}/colored-papers-rack.jpg`,
  ],
  "giay-ford-mau-a4-80": [
    `${F}/colored-papers-rack.jpg`,
    `${F}/colorful-papers-stacked.jpg`,
  ],
  "giay-ford-mau-a5-70": [
    `${F}/office-paper-trays.jpg`,
    `${F}/colorful-papers-stacked.jpg`,
  ],
  "giay-ford-mau-a5-80": [
    `${F}/colorful-papers-stacked.jpg`,
    `${F}/office-paper-trays.jpg`,
  ],
  "giay-ford-mau-dac-biet-grand": [
    `${F}/colored-papers-rack.jpg`,
    `${F}/colorful-papers-stacked.jpg`,
    `${F}/office-paper-trays.jpg`,
  ],
};

export function resolveGiayFordMauImages(product: {
  slug: string;
  name?: string;
}): string[] | null {
  if (SLUG_IMAGES[product.slug]) return SLUG_IMAGES[product.slug];
  if (/ford/i.test(product.name ?? "") || product.slug.includes("ford-mau")) {
    return [GIAY_FORD_CATEGORY_HERO, `${F}/colored-papers-rack.jpg`];
  }
  return null;
}
