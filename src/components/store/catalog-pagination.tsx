import Link from "next/link";

function buildPageHref(
  basePath: string,
  searchParams: Record<string, string | undefined>,
  page: number,
): string {
  const q = new URLSearchParams();
  for (const [key, value] of Object.entries(searchParams)) {
    if (key === "page" || !value?.trim()) continue;
    q.set(key, value.trim());
  }
  if (page > 1) q.set("page", String(page));
  const qs = q.toString();
  return qs ? `${basePath}?${qs}` : basePath;
}

type CatalogPaginationProps = {
  basePath: string;
  searchParams: Record<string, string | undefined>;
  page: number;
  totalPages: number;
  total: number;
};

export function CatalogPagination({
  basePath,
  searchParams,
  page,
  totalPages,
  total,
}: CatalogPaginationProps) {
  if (totalPages <= 1) return null;

  const windowStart = Math.max(1, page - 2);
  const windowEnd = Math.min(totalPages, page + 2);
  const pages: number[] = [];
  for (let p = windowStart; p <= windowEnd; p += 1) pages.push(p);

  return (
    <nav
      className="mt-10 flex flex-wrap items-center justify-center gap-2"
      aria-label="Phân trang sản phẩm"
    >
      <span className="mr-2 w-full text-center text-sm text-[var(--brand-muted)] sm:mr-0 sm:w-auto sm:text-left">
        {total.toLocaleString("vi-VN")} sản phẩm · Trang {page}/{totalPages}
      </span>
      {page > 1 ? (
        <Link
          href={buildPageHref(basePath, searchParams, page - 1)}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium hover:border-[var(--brand-primary)]"
          rel={page === 2 ? undefined : "prev"}
        >
          Trước
        </Link>
      ) : null}
      {pages.map((p) =>
        p === page ? (
          <span
            key={p}
            className="brand-gradient-bg min-w-[2.5rem] rounded-lg px-3 py-2 text-center text-sm font-semibold text-white"
            aria-current="page"
          >
            {p}
          </span>
        ) : (
          <Link
            key={p}
            href={buildPageHref(basePath, searchParams, p)}
            className="min-w-[2.5rem] rounded-lg border border-slate-200 bg-white px-3 py-2 text-center text-sm font-medium hover:border-[var(--brand-primary)]"
          >
            {p}
          </Link>
        ),
      )}
      {page < totalPages ? (
        <Link
          href={buildPageHref(basePath, searchParams, page + 1)}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium hover:border-[var(--brand-primary)]"
          rel="next"
        >
          Sau
        </Link>
      ) : null}
    </nav>
  );
}
