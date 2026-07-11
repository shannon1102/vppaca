import Image from "next/image";
import Link from "next/link";
import type { SiteSettings } from "@/lib/types";
import { TAM_DUC_BRAND } from "@/lib/brand-content";
import { SocialIcons } from "@/components/store/social-icons";

export function SiteFooter({ settings }: { settings: SiteSettings }) {
  return (
    <footer className="mt-auto bg-[var(--brand-secondary)] text-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:grid-cols-2 lg:grid-cols-4">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-3">
            <Image
              src={settings.logo_url}
              alt={settings.shop_name}
              width={44}
              height={44}
              className="h-11 w-11 rounded-xl bg-white/10 object-contain p-1"
            />
            <div>
              <p className="font-bold leading-tight">{settings.shop_name}</p>
              <p className="text-xs text-white/70">{settings.tagline}</p>
            </div>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-white/75">
            {TAM_DUC_BRAND.footerDescription}
          </p>
          <div className="mt-5">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-white/60">
              Kết nối với chúng tôi
            </p>
            <SocialIcons settings={settings} variant="footer" />
          </div>
        </div>

        {/* About */}
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wide">Về chúng tôi</h3>
          <ul className="mt-4 space-y-2.5 text-sm text-white/80">
            <li>
              <Link href="/gioi-thieu" className="hover:text-white">
                Giới thiệu
              </Link>
            </li>
            <li>
              <Link href="/lien-he" className="hover:text-white">
                Hệ thống cửa hàng
              </Link>
            </li>
            <li>
              <Link href="/lien-he" className="hover:text-white">
                Liên hệ hợp tác
              </Link>
            </li>
            <li>
              <Link href="/admin" className="hover:text-white">
                Quản trị
              </Link>
            </li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wide">Hỗ trợ khách hàng</h3>
          <ul className="mt-4 space-y-2.5 text-sm text-white/80">
            <li>
              <Link href="/chinh-sach" className="hover:text-white">
                Chính sách bảo hành
              </Link>
            </li>
            <li>
              <Link href="/chinh-sach" className="hover:text-white">
                Đổi trả sản phẩm
              </Link>
            </li>
            <li>
              <Link href="/san-pham" className="hover:text-white">
                Hướng dẫn mua hàng
              </Link>
            </li>
            <li>
              <Link href="/lien-he" className="hover:text-white">
                Tra cứu đơn hàng
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact only — no promo newsletter */}
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wide">Liên hệ</h3>
          <div className="mt-4 space-y-2 text-sm text-white/80">
            <p>{settings.address}</p>
            <p>
              Hotline:{" "}
              <a
                className="font-semibold text-white hover:underline"
                href={`tel:${settings.phone.replace(/\s/g, "")}`}
              >
                {settings.phone}
              </a>
              {" · "}
              <a
                className="font-semibold text-white hover:underline"
                href={`tel:${TAM_DUC_BRAND.phoneSecondary.replace(/\s/g, "")}`}
              >
                {TAM_DUC_BRAND.phoneSecondary}
              </a>
            </p>
            <p>
              Email:{" "}
              <a className="hover:underline" href={`mailto:${settings.email}`}>
                {settings.email}
              </a>
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-4 text-xs text-white/55 sm:flex-row">
          <p>
            © {new Date().getFullYear()} {settings.shop_name}. MST: {TAM_DUC_BRAND.taxCode}
          </p>
          <p>{TAM_DUC_BRAND.legalName}</p>
        </div>
      </div>
    </footer>
  );
}
