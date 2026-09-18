import Link from "next/link";
import { Suspense } from "react";
import { ProductPriceFilter } from "@/components/store/product-price-filter";
import { buildCategoryNav } from "@/lib/catalog/category-tree";
import type { Category, Product } from "@/lib/types";

export function CatalogSidebar({
  basePath,
  categories,
  products,
  activeCategorySlug,
}: {
  basePath: string;
  categories: Category[];
  products: Product[];
  activeCategorySlug?: string;
}) {
  const brands = [...new Set(products.map((p) => p.brand).filter(Boolean))].sort();
  const navGroups = buildCategoryNav(categories);

  return (
    <aside className="sticky top-24 hidden self-start md:block">
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

      {brands.length > 0 ? (
        <div className="catalog-sidebar-panel">
          <h2 className="catalog-sidebar-panel__title">Thương hiệu</h2>
          <ul className="max-h-48 space-y-1 overflow-y-auto text-sm">
            {brands.map((b) => (
              <li key={b}>
                <Link
                  href={`${basePath}?brand=${encodeURIComponent(b)}`}
                  className="text-[var(--brand-primary)] hover:underline"
                >
                  {b}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <Suspense fallback={null}>
        <ProductPriceFilter basePath={basePath} />
      </Suspense>
    </aside>
  );
}
