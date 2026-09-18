"use client";

import Link from "next/link";
import { useState } from "react";
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

export function CategoryNavDropdown({ groups }: { groups: CategoryNavGroup[] }) {
  return (
    <div className="absolute left-0 top-full z-50 mt-1 max-h-[min(70vh,28rem)] w-72 overflow-y-auto rounded-[var(--radius)] border border-slate-300 bg-white py-1 shadow-xl ring-1 ring-slate-200/80">
      <Link
        href="/san-pham"
        className="block px-4 py-2.5 text-sm font-medium hover:bg-slate-50 hover:text-[var(--brand-primary)]"
      >
        Tất cả sản phẩm
      </Link>
      {groups.map(({ category, children }) => (
        <div key={category.id} className="border-t border-slate-100 first:border-t-0">
          <Link
            href={`/danh-muc/${category.slug}`}
            className="block px-4 py-2.5 text-sm font-semibold hover:bg-slate-50 hover:text-[var(--brand-primary)]"
          >
            {category.name}
          </Link>
          {children.map((sub) => (
            <Link
              key={sub.id}
              href={`/danh-muc/${sub.slug}`}
              className="block py-2 pl-7 pr-4 text-sm text-[var(--brand-muted)] hover:bg-slate-50 hover:text-[var(--brand-primary)]"
            >
              {sub.name}
            </Link>
          ))}
        </div>
      ))}
    </div>
  );
}

export function CategoryNavMobile({
  groups,
  onNavigate,
}: {
  groups: CategoryNavGroup[];
  onNavigate: () => void;
}) {
  const [expanded, setExpanded] = useState<string | null>("cat-giay");

  return (
    <div className="flex flex-col gap-1">
      <Link
        href="/"
        className="rounded-lg px-3 py-2.5 text-sm font-bold uppercase tracking-wide hover:bg-slate-50"
        onClick={onNavigate}
      >
        Trang chủ
      </Link>
      {groups.map(({ category, children }) => {
        const hasChildren = children.length > 0;
        const isOpen = expanded === category.id;
        return (
          <div key={category.id}>
            <div className="flex items-center gap-1">
              {hasChildren ? (
                <button
                  type="button"
                  className="flex flex-1 items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm font-bold uppercase tracking-wide hover:bg-slate-50"
                  onClick={() => setExpanded(isOpen ? null : category.id)}
                >
                  {category.name}
                  <Chevron open={isOpen} />
                </button>
              ) : (
                <Link
                  href={`/danh-muc/${category.slug}`}
                  className="flex-1 rounded-lg px-3 py-2.5 text-sm font-bold uppercase tracking-wide hover:bg-slate-50"
                  onClick={onNavigate}
                >
                  {category.name}
                </Link>
              )}
            </div>
            {hasChildren && isOpen ? (
              <div className="ml-2 flex flex-col border-l border-slate-200 pl-2">
                {children.map((sub) => (
                  <Link
                    key={sub.id}
                    href={`/danh-muc/${sub.slug}`}
                    className="rounded-lg px-3 py-2 text-sm hover:bg-slate-50"
                    onClick={onNavigate}
                  >
                    {sub.name}
                  </Link>
                ))}
                <Link
                  href={`/danh-muc/${category.slug}`}
                  className="rounded-lg px-3 py-2 text-xs font-medium text-[var(--brand-primary)] hover:bg-slate-50"
                  onClick={onNavigate}
                >
                  Xem tất cả {category.name}
                </Link>
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
