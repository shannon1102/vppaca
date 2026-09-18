"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { CartLink } from "@/components/store/cart-link";
import { CategoryNavDropdown, CategoryNavMobile } from "@/components/store/category-nav-menu";
import { buildCategoryNav } from "@/lib/catalog/category-tree";
import type { Category } from "@/lib/types";

const navLinks = [
  { href: "/san-pham", label: "Tất cả sản phẩm" },
  { href: "/san-pham?sale=1", label: "Flash Sale" },
  { href: "/bao-gia-doanh-nghiep", label: "Báo giá B2B" },
  { href: "/gioi-thieu", label: "Giới thiệu" },
  { href: "/lien-he", label: "Liên hệ" },
  { href: "/chinh-sach", label: "Chính sách" },
];

export function HeaderInteractive({
  phone,
  categories,
  shopName,
  tagline,
  logoUrl,
}: {
  phone: string;
  categories: Category[];
  shopName: string;
  tagline: string;
  logoUrl: string;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [catOpen, setCatOpen] = useState(false);
  const [q, setQ] = useState("");
  const router = useRouter();
  const categoryGroups = buildCategoryNav(categories);

  function onSearch(e: FormEvent) {
    e.preventDefault();
    const query = q.trim();
    router.push(query ? `/san-pham?q=${encodeURIComponent(query)}` : "/san-pham");
    setMenuOpen(false);
  }

  return (
    <>
      <div className="border-b border-slate-200 bg-[var(--brand-surface)]">
        <div className="shop-container flex items-center gap-3 py-3 md:gap-6 md:py-4">
          <Link href="/" className="flex min-w-0 shrink-0 items-center gap-2.5">
            <Image
              src={logoUrl}
              alt={shopName}
              width={48}
              height={48}
              className="h-11 w-11 rounded-xl object-contain md:h-12 md:w-12"
            />
            <span className="hidden min-w-0 sm:block">
              <span className="block truncate text-base font-bold leading-tight text-[var(--brand-text)] md:text-lg">
                {shopName}
              </span>
              <span className="block truncate text-xs text-[var(--brand-muted)]">{tagline}</span>
            </span>
          </Link>

          <form onSubmit={onSearch} className="relative hidden min-w-0 flex-1 md:block">
            <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--brand-muted)]">
              <SearchIcon />
            </span>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Tìm giấy A4, bút bi, mực in, bìa còng..."
              className="h-12 w-full rounded-full border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm outline-none transition focus:border-[var(--brand-sale)] focus:bg-white focus:ring-2 focus:ring-[var(--brand-sale)]/20"
            />
          </form>

          <div className="ml-auto flex items-center gap-2">
            <a
              href={`tel:${phone.replace(/\s/g, "")}`}
              className="hidden h-11 min-w-11 items-center justify-center rounded-full border border-slate-200 text-[var(--brand-primary)] transition hover:border-[var(--brand-primary)] hover:bg-green-50 lg:inline-flex"
              aria-label="Gọi hotline"
              title={phone}
            >
              <PhoneIcon />
            </a>
            <Link
              href="/lien-he"
              className="hidden h-11 min-w-11 items-center justify-center rounded-full border border-slate-200 text-[var(--brand-text)] transition hover:border-[var(--brand-primary)] hover:text-[var(--brand-primary)] sm:inline-flex"
              aria-label="Liên hệ"
            >
              <UserIcon />
            </Link>
            <CartLink />
            <button
              type="button"
              className="inline-flex h-11 min-w-11 items-center justify-center rounded-full border border-slate-200 md:hidden"
              aria-label="Mở menu"
              onClick={() => setMenuOpen((v) => !v)}
            >
              <MenuIcon />
            </button>
          </div>
        </div>

        <form onSubmit={onSearch} className="relative px-4 pb-3 md:hidden">
          <span className="pointer-events-none absolute left-7 top-1/2 -translate-y-1/2 text-[var(--brand-muted)]">
            <SearchIcon />
          </span>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Tìm sản phẩm..."
            className="h-11 w-full rounded-full border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm outline-none focus:border-[var(--brand-primary)] focus:ring-2 focus:ring-[var(--brand-primary)]/20"
          />
        </form>
      </div>

      <div className="hidden border-b border-slate-200 bg-[var(--brand-surface)] md:block">
        <div className="shop-container flex items-center gap-2 py-2.5">
          <div className="relative">
            <button
              type="button"
              onClick={() => setCatOpen((v) => !v)}
              onBlur={() => setTimeout(() => setCatOpen(false), 150)}
              className="inline-flex h-11 items-center gap-2 rounded-[var(--radius)] bg-[var(--brand-primary)] px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-[var(--brand-primary-hover)]"
            >
              <MenuIcon />
              Danh mục sản phẩm
            </button>
            {catOpen ? <CategoryNavDropdown groups={categoryGroups} /> : null}
          </div>
          <nav className="flex flex-1 items-center gap-1 overflow-x-auto pl-2">
            {navLinks.map((l) => (
              <Link key={l.href + l.label} href={l.href} className="whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium text-[var(--brand-text)] transition hover:bg-slate-50 hover:text-[var(--brand-primary)]">
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {menuOpen ? (
        <div className="border-b border-slate-200 bg-white px-4 py-3 md:hidden">
          <CategoryNavMobile groups={categoryGroups} onNavigate={() => setMenuOpen(false)} />
          <div className="mt-2 flex flex-col gap-1">
            <Link href="/san-pham" className="rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-slate-50" onClick={() => setMenuOpen(false)}>
              Tất cả sản phẩm
            </Link>
          </div>
          <div className="mt-3 flex flex-col gap-1 border-t border-slate-100 pt-3">
            {navLinks.map((l) => (
              <Link key={l.href + l.label} href={l.href} className="rounded-lg px-3 py-2.5 text-sm hover:bg-slate-50" onClick={() => setMenuOpen(false)}>
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </>
  );
}

function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
      <path d="M20 20l-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2" />
      <path d="M4 20c1.5-3.5 4.5-5 8-5s6.5 1.5 8 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M6.5 3.5l2.2 2.2a1 1 0 01.2 1.1L7.8 9.2a12 12 0 007 7l2.4-1.1a1 1 0 011.1.2l2.2 2.2a1 1 0 01-.1 1.5A16 16 0 015 4.6a1 1 0 011.5-.1z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
