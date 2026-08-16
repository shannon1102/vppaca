"use client";

import { useMemo, useState } from "react";
import type { TocItem } from "@/lib/content/article-toc";

type NumberedTocItem = TocItem & { label: string };

function withHierarchicalNumbers(items: TocItem[]): NumberedTocItem[] {
  let major = 0;
  let minor = 0;
  return items.map((item) => {
    if (item.level === 2) {
      major += 1;
      minor = 0;
      return { ...item, label: `${major}` };
    }
    if (major === 0) major = 1;
    minor += 1;
    return { ...item, label: `${major}.${minor}` };
  });
}

function ListIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <line x1="8" y1="6" x2="21" y2="6" />
      <line x1="8" y1="12" x2="21" y2="12" />
      <line x1="8" y1="18" x2="21" y2="18" />
      <line x1="3" y1="6" x2="3.01" y2="6" />
      <line x1="3" y1="12" x2="3.01" y2="12" />
      <line x1="3" y1="18" x2="3.01" y2="18" />
    </svg>
  );
}

function ChevronIcon({ open, className }: { open: boolean; className?: string }) {
  return (
    <svg
      className={`${className ?? ""} transition-transform ${open ? "rotate-180" : ""}`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

/** WordPress-style collapsible TOC — health articles only. */
export function ArticleToc({ items }: { items: TocItem[] }) {
  const [open, setOpen] = useState(true);
  const numbered = useMemo(() => withHierarchicalNumbers(items), [items]);

  if (items.length < 2) return null;

  return (
    <nav
      className="article-toc mb-10 overflow-hidden rounded-md border border-slate-800/80 bg-[#f3f4f6]"
      aria-label="Nội dung bài viết"
    >
      <button
        type="button"
        className="flex w-full cursor-pointer items-center gap-2 px-4 py-3 text-left"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <ListIcon className="h-5 w-5 shrink-0 text-slate-800" />
        <span className="flex-1 text-base font-bold text-slate-900">
          Nội dung bài viết
        </span>
        <ChevronIcon open={open} className="h-5 w-5 shrink-0 text-slate-700" />
      </button>

      {open ? (
        <ol className="space-y-2 border-t border-slate-300/70 px-4 py-3 text-sm sm:text-base">
          {numbered.map((item) => (
            <li
              key={item.id}
              className={`list-none ${item.level === 3 ? "ml-5 sm:ml-6" : ""}`}
            >
              <a
                href={`#${item.id}`}
                className="text-slate-900 underline underline-offset-2 hover:text-[var(--brand-primary)]"
              >
                <span className="font-medium tabular-nums">{item.label}.</span>{" "}
                {item.text}
              </a>
            </li>
          ))}
        </ol>
      ) : null}
    </nav>
  );
}
