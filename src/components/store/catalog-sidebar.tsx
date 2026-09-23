import Link from "next/link";
import { Suspense } from "react";
import { CatalogCategoryAccordion } from "@/components/store/catalog-category-accordion";
import { CatalogBrandFilter } from "@/components/store/catalog-brand-filter";
import { CatalogSortBar } from "@/components/store/catalog-sort-bar";
import { ProductPriceFilter } from "@/components/store/product-price-filter";
import { buildCategoryNav } from "@/lib/catalog/category-tree";
import type { Category, Product } from "@/lib/types";

export function CatalogSidebar({
  basePath,
  categories,
  products,
  activeCategorySlug,
  searchParams = {},
}: {
  basePath: string;
  categories: Category[];
  products: Product[];
  activeCategorySlug?: string;
  searchParams?: Record<string, string | undefined>;
}) {
  const brands = [...new Set(products.map((p) => p.brand).filter(Boolean))].sort();
  const navGroups = buildCategoryNav(categories);

  return (
    <aside className="sticky top-28 hidden self-start md:block">
      <Suspense fallback={null}>
        <CatalogSortBar basePath={basePath} searchParams={searchParams} />
      </Suspense>

      <div className="catalog-sidebar-panel">
        <h2 className="catalog-sidebar-panel__title">Danh mục</h2>
        <CatalogCategoryAccordion groups={navGroups} activeCategorySlug={activeCategorySlug} />
      </div>

      <Suspense fallback={null}>
        <CatalogBrandFilter basePath={basePath} brands={brands} />
      </Suspense>

      <Suspense fallback={null}>
        <ProductPriceFilter basePath={basePath} variant="checkbox" />
      </Suspense>
    </aside>
  );
}
