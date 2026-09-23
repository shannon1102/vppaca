/**
 * Ảnh minh họa giấy Ford màu (ảnh ACA — public/products/ford-mau/).
 */

const FORD_HERO = "/products/ford-mau/ford-mau-colored-papers.jpg";

export const GIAY_FORD_CATEGORY_HERO = FORD_HERO;

const ALL_FORD = [FORD_HERO];

const SLUG_IMAGES: Record<string, string[]> = {
  "giay-ford-mau-a4-70": ALL_FORD,
  "giay-ford-mau-a4-80": ALL_FORD,
  "giay-ford-mau-a5-70": ALL_FORD,
  "giay-ford-mau-a5-80": ALL_FORD,
  "giay-ford-mau-dac-biet-grand": ALL_FORD,
};

export function resolveGiayFordMauImages(product: {
  slug: string;
  name?: string;
}): string[] | null {
  if (SLUG_IMAGES[product.slug]) return SLUG_IMAGES[product.slug];
  if (/ford/i.test(product.name ?? "") || product.slug.includes("ford-mau")) {
    return ALL_FORD;
  }
  return null;
}
