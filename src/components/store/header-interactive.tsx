"use client";

import Link from "next/link";
import { BrandLogo } from "@/components/store/brand-logo";
import { FormEvent, useState, type ReactNode } from "react";
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
  const tel = phone.replace(/\s/g, "");

  function onSearch(e: FormEvent) {
    e.preventDefault();
    const query = q.trim();
    router.push(query ? `/san-pham?q=${encodeURIComponent(query)}` : "/san-pham");
    setMenuOpen(false);
  }

  return (
    <header className="sticky top-0 z-50 shadow-sm">
      <div className="bg-[var(--tl-header-bright)] text-center text-[13px] font-medium text-white">
        <p className="shop-container py-2">
          Cam kết hàng chính hãng 100% · Hotline {phone}
        </p>
      </div>

      <div className="bg-[var(--brand-primary)] text-white">
        <div className="shop-container flex items-center gap-3 py-3 lg:gap-6 lg:py-4">
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center md:hidden"
            aria-label="Mở menu"
            onClick={() => setMenuOpen((v) => !v)}
          >
            <MenuIcon />
          </button>

          <Link href="/" className="flex min-w-0 shrink-0 items-center gap-2.5">
            <BrandLogo
              src={logoUrl}
              alt={shopName}
              width={48}
              height={48}
              className="h-11 w-11 rounded-lg bg-white object-contain p-1 md:h-12 md:w-12"
              priority
            />
            <span className="hidden min-w-0 xl:block">
              <span className="block truncate text-base font-bold leading-tight text-white md:text-lg">
                {shopName}
              </span>
              <span className="block truncate text-xs text-white/75">{tagline}</span>
            </span>
          </Link>

          <div className="hidden min-w-0 flex-1 md:block">
            <form onSubmit={onSearch} className="relative mx-auto max-w-[680px]">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Tìm kiếm sản phẩm..."
                className="h-11 w-full rounded border border-[#ececec] bg-white px-3.5 pr-20 text-sm font-medium text-[var(--brand-text)] outline-none focus:border-white"
              />
              <button type="submit" className="shop-search-submit" aria-label="Tìm kiếm">
                <SearchIcon />
              </button>
            </form>
            <ul className="mx-auto mt-2.5 hidden max-w-[680px] items-center gap-5 text-xs text-white lg:flex">
              <li className="inline-flex items-center gap-1.5">
                <ShieldIcon />
                Sản phẩm chính hãng
              </li>
              <li className="inline-flex items-center gap-1.5">
                <TruckIcon />
                Giao nhanh toàn quốc
              </li>
              <li className="inline-flex items-center gap-1.5">
                <DocIcon />
                Hỗ trợ xuất VAT
              </li>
            </ul>
          </div>

          <div className="ml-auto flex items-center gap-4 lg:gap-6">
            <HeaderAction href="/lien-he" icon={<OrderIcon />} label="Kiểm tra" sub="đơn hàng" />
            <HeaderAction href={`tel:${tel}`} icon={<PhoneIcon />} label="Hotline" sub={phone} />
            <HeaderAction href="/lien-he" icon={<UserIcon />} label="Liên hệ" sub="Hỗ trợ" />
            <CartLink variant="header" />
          </div>
        </div>

        <form onSubmit={onSearch} className="shop-container pb-3 md:hidden">
          <div className="relative">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Tìm kiếm sản phẩm..."
              className="h-11 w-full rounded border border-[#ececec] bg-white px-3.5 pr-20 text-sm font-medium text-[var(--brand-text)] outline-none"
            />
            <button type="submit" className="shop-search-submit" aria-label="Tìm kiếm">
              <SearchIcon />
            </button>
          </div>
        </form>
      </div>

      <div className="hidden border-b border-[#d5e4fb] bg-[var(--tl-nav-bg)] md:block">
        <div className="shop-container flex items-center gap-1">
          <div
            className="relative"
            onMouseEnter={() => setCatOpen(true)}
            onMouseLeave={() => setCatOpen(false)}
          >
            <button
              type="button"
              onClick={() => setCatOpen((v) => !v)}
              className="inline-flex items-center gap-2 py-3.5 pr-3 text-sm font-medium uppercase tracking-wide text-[#343a40] hover:text-[var(--brand-primary)]"
              aria-expanded={catOpen}
            >
              <MenuIcon />
              Danh mục
            </button>
            {catOpen ? <CategoryNavDropdown groups={categoryGroups} /> : null}
          </div>
          <nav className="flex flex-1 items-center gap-1 overflow-x-auto">
            {navLinks.map((l) => (
              <Link
                key={l.href + l.label}
                href={l.href}
                className="whitespace-nowrap px-3 py-3.5 text-sm font-medium uppercase tracking-wide text-[#343a40] transition hover:text-[var(--brand-primary)]"
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {menuOpen ? (
        <div className="border-b border-slate-200 bg-white px-4 py-3 md:hidden">
          <CategoryNavMobile groups={categoryGroups} onNavigate={() => setMenuOpen(false)} />
          <div className="mt-3 flex flex-col gap-1 border-t border-slate-100 pt-3">
            {navLinks.map((l) => (
              <Link
                key={l.href + l.label}
                href={l.href}
                className="rounded-lg px-3 py-2.5 text-sm hover:bg-slate-50"
                onClick={() => setMenuOpen(false)}
              >
                {l.label}
              </Link>
            ))}
            <a href={`tel:${tel}`} className="rounded-lg px-3 py-2.5 text-sm font-semibold text-[var(--brand-primary)]">
              Hotline: {phone}
            </a>
          </div>
        </div>
      ) : null}
    </header>
  );
}

function HeaderAction({
  href,
  icon,
  label,
  sub,
}: {
  href: string;
  icon: ReactNode;
  label: string;
  sub: string;
}) {
  const className = "hidden items-center gap-1.5 text-white xl:inline-flex";
  const inner = (
    <>
      <span className="inline-flex h-10 w-8 items-center justify-center">{icon}</span>
      <span className="text-left text-[12px] leading-tight">
        {label}
        <span className="mt-0.5 block text-[13px] font-medium">{sub}</span>
      </span>
    </>
  );
  if (href.startsWith("tel:")) {
    return (
      <a href={href} className={className}>
        {inner}
      </a>
    );
  }
  return (
    <Link href={href} className={className}>
      {inner}
    </Link>
  );
}

function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M10 2a8 8 0 105.3 14l4.4 4.3 1.4-1.4-4.3-4.4A8 8 0 0010 2zm0 2a6 6 0 110 12 6 6 0 010-12z" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 12a4 4 0 100-8 4 4 0 000 8zm0 2c-4.4 0-8 2.2-8 5v1h16v-1c0-2.8-3.6-5-8-5z" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M6.6 3.2l2.2 2.2c.3.3.4.8.2 1.2l-1.1 2.4a12 12 0 007 7l2.4-1.1c.4-.2.9-.1 1.2.2l2.2 2.2c.4.4.4 1 0 1.4l-1.2 1.2C17.8 22 8 16.5 4.2 8.4L3 7.2c-.4-.4-.4-1 0-1.4l2.2-2.2c.4-.4 1-.4 1.4 0z" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function OrderIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M7 3h10a2 2 0 012 2v16l-2-1.2L15 21l-2-1.2L11 21l-2-1.2L7 21l-2-1.2V5a2 2 0 012-2zm2.2 5.2l-1.4 1.4 2.2 2.2 4.2-4.2-1.4-1.4-2.8 2.8-0.8-.8zM8 14h8v1.6H8V14zm0 3h6v1.6H8V17z" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" stroke="currentColor" strokeWidth="1.8" />
      <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function TruckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M3 7h11v8H3V7zm11 2h4l3 3v3h-7V9z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <circle cx="7" cy="17.5" r="1.5" fill="currentColor" />
      <circle cx="17" cy="17.5" r="1.5" fill="currentColor" />
    </svg>
  );
}

function DocIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M7 3h7l5 5v13H7V3z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M14 3v5h5M9 13h6M9 17h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
