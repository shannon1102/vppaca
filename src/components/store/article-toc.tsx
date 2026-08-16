"use client";

import { useState } from "react";
import type { TocItem } from "@/lib/content/article-toc";

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

/**
 * Collapsible TOC — health articles only.
 * No auto-numbering: Quill headings often already include "1.", "2.1." etc.
 */
export function ArticleToc({ items }: { items: TocItem[] }) {
  const [open, setOpen] = useState(true);

  if (items.length < 2) return null;

  return (
    <nav
      className="article-toc mb-10 overflow-hidden rounded-md border border-slate-800/80 bg-[#f3f4f6]"
      aria-label="Nội dung bài viết"
    >
      <button
        type="button"
        className="flex w-full cursor-pointer items-center gap-2.5 px-6 py-4 text-left sm:px-8 sm:py-4"
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
        <ul className="space-y-0 border-t border-slate-300/70 px-6 py-4 text-sm leading-snug sm:px-8 sm:py-5 sm:text-base">
          {items.map((item) => (
            <li
              key={item.id}
              className={`flex list-none gap-2 ${item.level === 3 ? "ml-5 sm:ml-7" : ""}`}
            >
              <span
                className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-700"
                aria-hidden
              />
              <a
                href={`#${item.id}`}
                className="py-0.5 text-slate-900 underline underline-offset-2 hover:text-[var(--brand-primary)]"
              >
                {item.text}
              </a>
            </li>
          ))}
        </ul>
      ) : null}
    </nav>
  );
}
