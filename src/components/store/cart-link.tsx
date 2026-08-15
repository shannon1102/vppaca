"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { useCart } from "@/store/cart";

function useHydrated() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

export function CartLink() {
  const count = useCart((s) => s.count());
  const mounted = useHydrated();

  return (
    <Link
      href="/gio-hang"
      className="relative inline-flex h-11 min-w-11 items-center justify-center rounded-full border border-slate-200 text-[var(--brand-text)] transition hover:border-[var(--brand-primary)] hover:text-[var(--brand-primary)]"
      aria-label="Giỏ hàng"
    >
      <CartIcon />
      {mounted && count > 0 ? (
        <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
          {count}
        </span>
      ) : null}
    </Link>
  );
}

function CartIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M6 6h15l-1.5 9h-12L6 6zm0 0L5 3H2"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="9" cy="20" r="1.5" fill="currentColor" />
      <circle cx="17" cy="20" r="1.5" fill="currentColor" />
    </svg>
  );
}
