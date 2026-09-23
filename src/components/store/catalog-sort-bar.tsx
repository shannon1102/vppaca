import Link from "next/link";

const sorts = [
  { key: "", label: "Mặc định" },
  { key: "sold", label: "Bán chạy" },
  { key: "price-asc", label: "Giá tăng dần" },
  { key: "price-desc", label: "Giá giảm dần" },
] as const;

export function CatalogSortBar({
  basePath,
  searchParams,
}: {
  basePath: string;
  searchParams: Record<string, string | undefined>;
}) {
  const current = searchParams.sort ?? "";

  function hrefFor(sort: string) {
    const params = new URLSearchParams();
    for (const [k, v] of Object.entries(searchParams)) {
      if (v && k !== "sort" && k !== "page") params.set(k, v);
    }
    if (sort) params.set("sort", sort);
    const qs = params.toString();
    return qs ? `${basePath}?${qs}` : basePath;
  }

  return (
    <div className="catalog-sidebar-panel">
      <h2 className="catalog-sidebar-panel__title">Sắp xếp</h2>
      <ul className="space-y-0.5">
        {sorts.map((s) => (
          <li key={s.key || "default"}>
            <Link
              href={hrefFor(s.key)}
              className={`catalog-filter-check ${current === s.key ? "font-semibold text-[var(--tl-header-navy)]" : ""}`}
            >
              <input type="radio" readOnly checked={current === s.key} tabIndex={-1} aria-hidden />
              <span>{s.label}</span>
            </Link>
          </li>
        ))}
        <li>
          <Link
            href={(() => {
              const params = new URLSearchParams();
              for (const [k, v] of Object.entries(searchParams)) {
                if (v && k !== "sale" && k !== "page") params.set(k, v);
              }
              if (searchParams.sale !== "1") params.set("sale", "1");
              const qs = params.toString();
              return qs ? `${basePath}?${qs}` : `${basePath}?sale=1`;
            })()}
            className={`catalog-filter-check ${searchParams.sale === "1" ? "font-semibold text-[var(--brand-sale)]" : ""}`}
          >
            <input type="checkbox" readOnly checked={searchParams.sale === "1"} tabIndex={-1} aria-hidden />
            <span>Đang giảm giá</span>
          </Link>
        </li>
      </ul>
    </div>
  );
}
