import Image from "next/image";
import Link from "next/link";
import { HeaderInteractive } from "@/components/store/header-interactive";
import type { Category, SiteSettings } from "@/lib/types";

export function SiteHeader({
  settings,
  categories,
}: {
  settings: SiteSettings;
  categories: Category[];
}) {
  return (
    <header className="sticky top-0 z-50 shadow-sm">
      <div className="brand-gradient-bg text-white">
        <div className="shop-container flex flex-wrap items-center justify-between gap-2 py-2 text-xs sm:text-[13px]">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-white/90">
            <span className="inline-flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--brand-accent)]" />
              Cam kết hàng chính hãng 100%
            </span>
            <a
              href={`tel:${settings.phone.replace(/\s/g, "")}`}
              className="font-semibold hover:text-white"
            >
              Hotline: {settings.phone}
            </a>
          </div>
          <div className="hidden items-center gap-4 sm:flex">
            <Link href="/gioi-thieu" className="hover:text-white/80">
              Hệ thống cửa hàng
            </Link>
            <Link href="/lien-he" className="hover:text-white/80">
              Tra cứu đơn hàng
            </Link>
            <Link href="/lien-he" className="hover:text-white/80">
              Hỗ trợ
            </Link>
          </div>
        </div>
      </div>

      <HeaderInteractive phone={settings.phone} categories={categories} shopName={settings.shop_name} tagline={settings.tagline} logoUrl={settings.logo_url} />

      <div className="shop-header-trust hidden md:block">
        <div className="shop-container flex flex-wrap items-center justify-center gap-6 py-2 text-xs font-medium text-[var(--brand-muted)] lg:gap-10 lg:text-sm">
          <span className="inline-flex items-center gap-2">
            <TrustIcon />
            Sản phẩm chính hãng
          </span>
          <span className="inline-flex items-center gap-2">
            <TrustIcon />
            Giao nhanh toàn quốc
          </span>
          <span className="inline-flex items-center gap-2">
            <TrustIcon />
            Hỗ trợ xuất VAT &amp; báo giá B2B
          </span>
        </div>
      </div>
    </header>
  );
}

function TrustIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-[var(--tl-header-navy)]" aria-hidden>
      <path d="M12 2l8 4v6c0 5-3.5 9-8 10-4.5-1-8-5-8-10V6l8-4z" stroke="currentColor" strokeWidth="2" />
      <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
