"use client";

import Link from "next/link";
import { useState } from "react";
import type { CategoryNavGroup } from "@/lib/catalog/category-tree";

function ChevronRight() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden className="shrink-0 opacity-50">
      <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

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
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const active =
    groups.find((g) => g.category.id === hoveredId && g.children.length > 0) ?? null;

  return (
    <div
      className="category-nav-mega absolute left-0 top-full z-50 mt-1"
      onMouseLeave={() => setHoveredId(null)}
    >
      <div className="category-nav-mega__primary">
        <Link href="/san-pham" className="category-nav-mega__item category-nav-mega__item--all">
          Tất cả sản phẩm
        </Link>
        {groups.map(({ category, children }) => {
          const hasChildren = children.length > 0;
          const isActive = hoveredId === category.id;
          return (
            <div
              key={category.id}
              className="category-nav-mega__row"
              onMouseEnter={() => setHoveredId(hasChildren ? category.id : null)}
            >
              <Link
                href={`/danh-muc/${category.slug}`}
                className={`category-nav-mega__item ${isActive ? "category-nav-mega__item--active" : ""}`}
              >
                <span className="min-w-0 flex-1">{category.name}</span>
                {hasChildren ? <ChevronRight /> : null}
              </Link>
            </div>
          );
        })}
      </div>

      {active ? (
        <div className="category-nav-mega__flyout">
          <p className="category-nav-mega__flyout-title">{active.category.name}</p>
          {active.children.map((sub) => (
            <Link key={sub.id} href={`/danh-muc/${sub.slug}`} className="category-nav-mega__flyout-item">
              {sub.name}
            </Link>
          ))}
          <Link
            href={`/danh-muc/${active.category.slug}`}
            className="category-nav-mega__flyout-all"
          >
            Xem tất cả {active.category.name}
          </Link>
        </div>
      ) : null}
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
