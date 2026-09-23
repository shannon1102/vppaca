import Link from "next/link";

export function CatalogBreadcrumb({
  items,
}: {
  items: { name: string; href?: string }[];
}) {
  return (
    <nav aria-label="Breadcrumb" className="mb-4 text-sm text-[var(--brand-muted)]">
      <ol className="flex flex-wrap items-center gap-1">
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <li key={`${item.name}-${i}`} className="inline-flex items-center gap-1">
              {i > 0 ? <span className="text-slate-300">/</span> : null}
              {last || !item.href ? (
                <span className={last ? "font-medium text-[var(--brand-text)]" : undefined}>
                  {item.name}
                </span>
              ) : (
                <Link href={item.href} className="hover:text-[var(--brand-primary)] hover:underline">
                  {item.name}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
