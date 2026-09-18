import {
  filterAndSortProducts,
  type CatalogFilterParams,
} from "@/lib/catalog-filters";
import type { Product, PromotionProduct } from "@/lib/types";

export const DEFAULT_CATALOG_PAGE_SIZE = 24;

export type ProductsPageResult = {
  items: Product[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

export type ListProductsPageOptions = {
  products: Product[];
  filters?: CatalogFilterParams;
  promoProducts?: PromotionProduct[];
  page?: number;
  pageSize?: number;
};

export function paginateFilteredProducts(
  opts: ListProductsPageOptions,
): ProductsPageResult {
  const filtered = filterAndSortProducts(
    opts.products,
    opts.filters ?? {},
    opts.promoProducts ?? [],
  );
  const pageSize = Math.min(Math.max(opts.pageSize ?? DEFAULT_CATALOG_PAGE_SIZE, 1), 100);
  const page = Math.max(opts.page ?? 1, 1);
  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * pageSize;
  const items = filtered.slice(start, start + pageSize);
  return { items, total, page: safePage, pageSize, totalPages };
}

export function parseCatalogPage(raw: string | undefined): number {
  const n = Number(raw);
  if (!Number.isFinite(n) || n < 1) return 1;
  return Math.floor(n);
}
