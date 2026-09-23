import Link from "next/link";
import { Suspense } from "react";
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
        <ul className="space-y-2 text-sm">
          {navGroups.map(({ category, children }) => (
            <li key={category.id}>
              <Link
                href={`/danh-muc/${category.slug}`}
                className={
                  activeCategorySlug === category.slug
                    ? "font-semibold text-[var(--brand-sale)]"
                    : "font-medium text-[var(--brand-text)] hover:text-[var(--brand-primary)]"
                }
              >
                {category.name}
              </Link>
              {children.length > 0 ? (
                <ul className="mt-1 space-y-0.5 border-l-2 border-slate-200 pl-3">
                  {children.map((sub) => (
                    <li key={sub.id}>
                      <Link
                        href={`/danh-muc/${sub.slug}`}
                        className={
                          activeCategorySlug === sub.slug
                            ? "font-semibold text-[var(--brand-sale)]"
                            : "text-[var(--brand-primary)] hover:underline"
                        }
                      >
                        {sub.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : null}
            </li>
          ))}
        </ul>
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
