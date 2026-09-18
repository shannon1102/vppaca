import { effectivePrice } from "@/lib/format";
import type { Product, PromotionProduct } from "@/lib/types";

export type CatalogFilterParams = {
  q?: string;
  brand?: string;
  sale?: string;
  sort?: string;
  minPrice?: string;
  maxPrice?: string;
};

export function filterAndSortProducts(
  products: Product[],
  params: CatalogFilterParams,
  promoProducts: PromotionProduct[] = [],
): Product[] {
  const promoMap = new Map(promoProducts.map((p) => [p.product_id, p.sale_price]));
  let list = [...products];

  const q = params.q?.trim();
  if (q) {
    const needle = q.toLowerCase();
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(needle) ||
        p.sku.toLowerCase().includes(needle) ||
        p.description.toLowerCase().includes(needle) ||
        p.brand.toLowerCase().includes(needle),
    );
  }

  const brand = params.brand?.trim();
  if (brand) {
    const b = brand.toLowerCase();
    list = list.filter((p) => p.brand.toLowerCase() === b);
  }

  if (params.sale === "1") {
    list = list.filter(
      (p) =>
        promoMap.has(p.id) || (p.sale_price != null && p.sale_price < p.price),
    );
  }

  const min = params.minPrice ? Number(params.minPrice) : NaN;
  const max = params.maxPrice ? Number(params.maxPrice) : NaN;
  if (!Number.isNaN(min) && min > 0) {
    list = list.filter((p) => {
      const price = effectivePrice(p.price, promoMap.get(p.id) ?? p.sale_price);
      return price >= min;
    });
  }
  if (!Number.isNaN(max) && max > 0) {
    list = list.filter((p) => {
      const price = effectivePrice(p.price, promoMap.get(p.id) ?? p.sale_price);
      return price <= max;
    });
  }

  if (params.sort === "price-asc") {
    list.sort(
      (a, b) =>
        effectivePrice(a.price, promoMap.get(a.id) ?? a.sale_price) -
        effectivePrice(b.price, promoMap.get(b.id) ?? b.sale_price),
    );
  }
  if (params.sort === "price-desc") {
    list.sort(
      (a, b) =>
        effectivePrice(b.price, promoMap.get(b.id) ?? b.sale_price) -
        effectivePrice(a.price, promoMap.get(a.id) ?? a.sale_price),
    );
  }
  if (params.sort === "sold") {
    list.sort((a, b) => b.sold_count - a.sold_count);
  }

  return list;
}
