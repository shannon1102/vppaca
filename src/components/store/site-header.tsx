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
      <div className="bg-[var(--brand-secondary)] text-white">
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
    </header>
  );
}
