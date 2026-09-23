"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

export function CatalogBrandFilter({
  basePath,
  brands,
}: {
  basePath: string;
  brands: string[];
}) {
  const sp = useSearchParams();
  const active = sp.get("brand") ?? "";

  if (!brands.length) return null;

  return (
    <div className="catalog-sidebar-panel">
      <h2 className="catalog-sidebar-panel__title">Nhãn hàng</h2>
      <ul className="max-h-56 space-y-0.5 overflow-y-auto">
        {brands.map((b) => {
          const checked = active === b;
          const params = new URLSearchParams(sp.toString());
          if (checked) params.delete("brand");
          else params.set("brand", b);
          const qs = params.toString();
          const href = qs ? `${basePath}?${qs}` : basePath;
          return (
            <li key={b}>
              <Link href={href} className="catalog-filter-check">
                <input type="checkbox" readOnly checked={checked} tabIndex={-1} aria-hidden />
                <span>{b}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
