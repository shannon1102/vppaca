"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { CategoryNavGroup } from "@/lib/catalog/category-tree";

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      className={`shrink-0 transition ${open ? "rotate-180" : ""}`}
    >
      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function groupIsActive(group: CategoryNavGroup, activeCategorySlug?: string): boolean {
  if (!activeCategorySlug) return false;
  if (group.category.slug === activeCategorySlug) return true;
  return group.children.some((c) => c.slug === activeCategorySlug);
}

export function CatalogCategoryAccordion({
  groups,
  activeCategorySlug,
}: {
  groups: CategoryNavGroup[];
  activeCategorySlug?: string;
}) {
  const defaultExpanded = useMemo(() => {
    const ids = new Set<string>();
    for (const group of groups) {
      if (groupIsActive(group, activeCategorySlug)) {
        ids.add(group.category.id);
      }
    }
    return ids;
  }, [groups, activeCategorySlug]);

  const [expanded, setExpanded] = useState<Set<string>>(() => defaultExpanded);

  function toggle(id: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <ul className="space-y-1 text-sm">
      {groups.map(({ category, children }) => {
        const hasChildren = children.length > 0;
        const isOpen = expanded.has(category.id);
        const parentActive = activeCategorySlug === category.slug;

        if (!hasChildren) {
          return (
            <li key={category.id}>
              <Link
                href={`/danh-muc/${category.slug}`}
                className={
                  parentActive
                    ? "block rounded-md px-1 py-1.5 font-semibold text-[var(--brand-sale)]"
                    : "block rounded-md px-1 py-1.5 font-medium text-[var(--brand-text)] hover:text-[var(--brand-primary)]"
                }
              >
                {category.name}
              </Link>
            </li>
          );
        }

        return (
          <li key={category.id} className="rounded-md">
            <div className="flex items-center gap-1">
              <button
                type="button"
                className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-[var(--brand-muted)] hover:bg-slate-100 hover:text-[var(--brand-text)]"
                aria-expanded={isOpen}
                aria-label={isOpen ? `Thu gọn ${category.name}` : `Mở rộng ${category.name}`}
                onClick={() => toggle(category.id)}
              >
                <Chevron open={isOpen} />
              </button>
              <Link
                href={`/danh-muc/${category.slug}`}
                className={
                  parentActive
                    ? "min-w-0 flex-1 rounded-md py-1.5 font-semibold text-[var(--brand-sale)] hover:underline"
                    : "min-w-0 flex-1 rounded-md py-1.5 font-medium text-[var(--brand-text)] hover:text-[var(--brand-primary)] hover:underline"
                }
              >
                {category.name}
              </Link>
            </div>
            {isOpen ? (
              <ul className="mt-0.5 space-y-0.5 border-l-2 border-slate-200 pl-3">
                <li>
                  <Link
                    href={`/danh-muc/${category.slug}`}
                    className="block py-1 text-xs font-semibold text-[var(--tl-header-navy)] hover:underline"
                  >
                    Tất cả {category.name}
                  </Link>
                </li>
                {children.map((sub) => (
                  <li key={sub.id}>
                    <Link
                      href={`/danh-muc/${sub.slug}`}
                      className={
                        activeCategorySlug === sub.slug
                          ? "block py-1 font-semibold text-[var(--brand-sale)]"
                          : "block py-1 text-[var(--brand-primary)] hover:underline"
                      }
                    >
                      {sub.name}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}
