import Link from "next/link";

import { SocialIcons } from "@/components/store/social-icons";
import { VPPACA_BRAND } from "@/lib/brand-content";
import { repo } from "@/lib/data/repository";
import { socialLinks } from "@/lib/social";
import { pageMetadata, SEO_KEYWORDS } from "@/lib/seo/metadata";

export const metadata = pageMetadata({
  title: "Liên hệ VPPACA | Hotline văn phòng phẩm B2B & B2C",
  description:
    "Liên hệ Công ty TNHH VPP ACA — hotline, email, Zalo. Tư vấn giấy A4, VPP sỉ/lẻ, báo giá doanh nghiệp và giao hàng toàn quốc.",
  path: "/lien-he",
  keywords: [...SEO_KEYWORDS, "liên hệ văn phòng phẩm", "báo giá VPP doanh nghiệp"],
});

function telHref(phone: string) {
  return `tel:${phone.replace(/\s/g, "")}`;
}

export default async function ContactPage() {
  const s = await repo.getSettings();
  const links = socialLinks(s);

  return (
    <div className="shop-container max-w-4xl py-12">
      <h1 className="text-3xl font-bold">Liên hệ {s.shop_name}</h1>
      <p className="mt-3 leading-relaxed text-[var(--brand-muted)]">{VPPACA_BRAND.contactIntro}</p>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <div className="rounded-[var(--radius)] border border-slate-200 bg-white p-6 text-sm">
          <p className="font-semibold text-[var(--brand-text)]">{VPPACA_BRAND.legalName}</p>
          <p className="mt-1 text-[var(--brand-muted)]">
            Website:{" "}
            <a href="https://vppaca.vn" className="text-[var(--brand-primary)] hover:underline">
              vppaca.vn
            </a>
          </p>

          <h2 className="mt-6 font-semibold">Hotline</h2>
          <p className="mt-2">
            <a
              className="text-lg font-bold text-[var(--brand-primary)] hover:underline"
              href={telHref(s.phone)}
            >
              {s.phone}
            </a>
          </p>

          <h2 className="mt-6 font-semibold">Email</h2>
          <p className="mt-2">
            <a className="text-[var(--brand-primary)] hover:underline" href={`mailto:${s.email}`}>
              {s.email}
            </a>
          </p>

          <h2 className="mt-6 font-semibold">Giờ làm việc</h2>
          <p className="mt-2">{VPPACA_BRAND.hours}</p>

          <h2 className="mt-6 font-semibold">Báo giá doanh nghiệp (B2B)</h2>
          <p className="mt-2 text-[var(--brand-muted)]">
            Upload danh mục Excel trên website — ACA ghép mã và phản hồi báo giá tập trung.
          </p>
          <Link
            href="/bao-gia-doanh-nghiep"
            className="brand-gradient-bg mt-3 inline-flex rounded-lg px-4 py-2 text-sm font-semibold text-white"
          >
            Gửi yêu cầu báo giá
          </Link>

          <h2 className="mt-6 font-semibold">Kết nối nhanh</h2>
          <ul className="mt-3 space-y-2">
            <li>
              <a
                className="text-[var(--brand-primary)] underline"
                href={links.zalo}
                target="_blank"
                rel="noopener noreferrer"
              >
                Zalo — {s.phone}
              </a>
            </li>
            <li>
              <a
                className="text-[var(--brand-primary)] underline"
                href={links.facebook}
                target="_blank"
                rel="noopener noreferrer"
              >
                Facebook — VPPACA (ACA)
              </a>
            </li>
            <li>
              <a
                className="text-[var(--brand-primary)] underline"
                href={links.messenger}
                target="_blank"
                rel="noopener noreferrer"
              >
                Messenger — nhắn tin đặt hàng / báo giá
              </a>
            </li>
          </ul>
          <div className="mt-4">
            <SocialIcons settings={s} variant="footer" />
          </div>
        </div>

        <div className="space-y-4">
          {VPPACA_BRAND.branches.map((branch) => (
            <div
              key={branch.name}
              className="rounded-[var(--radius)] border border-slate-200 bg-white p-6 text-sm"
            >
              <h2 className="font-semibold">{branch.name}</h2>
              <p className="mt-2 text-[var(--brand-muted)]">{branch.address || s.address}</p>
              <a
                className="mt-3 inline-block text-[var(--brand-primary)] hover:underline"
                href={branch.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Xem trên Google Maps →
              </a>
            </div>
          ))}

          <div className="rounded-[var(--radius)] border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-[var(--brand-muted)]">
            <p className="font-medium text-[var(--brand-text)]">Tra cứu đơn hàng</p>
            <p className="mt-2">
              Ghi nhớ mã đơn khi thanh toán chuyển khoản. Cần hỗ trợ tra cứu, gọi hotline hoặc email kèm
              số điện thoại đặt hàng.
            </p>
            <Link href="/chinh-sach" className="mt-3 inline-block text-[var(--brand-primary)] underline">
              Xem chính sách bán hàng
            </Link>
          </div>
        </div>
      </div>

      <p className="mt-8 text-xs text-[var(--brand-muted)]">
        MST: {VPPACA_BRAND.taxCode} · {VPPACA_BRAND.legalName}. Cập nhật địa chỉ trụ sở chính thức khi hoàn
        tất đăng ký kinh doanh.
      </p>
    </div>
  );
}
