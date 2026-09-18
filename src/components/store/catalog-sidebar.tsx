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
    <aside className="hidden md:block">
      <h2 className="text-sm font-bold uppercase text-[var(--brand-muted)]">Danh mục</h2>
      <ul className="mt-3 space-y-2 text-sm">
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
              <ul className="mt-1 space-y-0.5 border-l border-slate-200 pl-3">
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

      <h2 className="mt-6 text-sm font-bold uppercase text-[var(--brand-muted)]">Thương hiệu</h2>
      <ul className="mt-3 max-h-48 space-y-1 overflow-y-auto text-sm">
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

      <Suspense fallback={null}>
        <ProductPriceFilter basePath={basePath} />
      </Suspense>
    </aside>
  );
}
