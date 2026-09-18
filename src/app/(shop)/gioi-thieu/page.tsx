import Link from "next/link";

import { VPPACA_BRAND } from "@/lib/brand-content";
import { repo } from "@/lib/data/repository";
import { pageMetadata, SEO_KEYWORDS } from "@/lib/seo/metadata";

export const metadata = pageMetadata({
  title: "Giới thiệu VPPACA | Văn phòng phẩm B2B & B2C",
  description:
    "Giới thiệu Công ty TNHH VPP ACA (VPPACA): giấy in, VPP chính hãng, giá sỉ minh bạch, báo giá doanh nghiệp Excel, giao hàng toàn quốc.",
  path: "/gioi-thieu",
  keywords: [...SEO_KEYWORDS, ...VPPACA_BRAND.seoKeywords],
});

export default async function AboutPage() {
  const s = await repo.getSettings();

  return (
    <div className="shop-container max-w-3xl py-12">
      <h1 className="text-3xl font-bold">Giới thiệu VPPACA (ACA)</h1>
      <p className="mt-3 text-lg font-medium text-[var(--brand-primary)]">{s.tagline}</p>

      <p className="mt-6 text-sm italic leading-relaxed text-[var(--brand-muted)]">
        {VPPACA_BRAND.aboutMarketContext}
      </p>

      <h2 className="mt-10 text-xl font-bold">Chúng tôi là ai</h2>
      <p className="mt-4 leading-relaxed text-[var(--brand-muted)]">{VPPACA_BRAND.aboutIntro}</p>

      <h2 className="mt-10 text-xl font-bold">Lợi thế cạnh tranh</h2>
      <ul className="mt-6 space-y-5">
        {VPPACA_BRAND.aboutAdvantages.map((item, index) => (
          <li
            key={item.title}
            className="rounded-[var(--radius)] border border-slate-200 bg-white p-5 shadow-sm"
          >
            <h3 className="font-semibold text-[var(--brand-primary)]">
              {index + 1}. {item.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-[var(--brand-muted)]">{item.body}</p>
          </li>
        ))}
      </ul>

      <h2 className="mt-10 text-xl font-bold">Đối tượng khách hàng</h2>
      <ul className="mt-4 list-inside list-disc space-y-2 leading-relaxed text-[var(--brand-muted)]">
        {VPPACA_BRAND.aboutAudiences.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>

      <h2 className="mt-10 text-xl font-bold">Cam kết</h2>
      <p className="mt-4 leading-relaxed text-[var(--brand-muted)]">{VPPACA_BRAND.aboutCommitment}</p>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href="/danh-muc/giay-in-so-vo"
          className="brand-gradient-bg rounded-lg px-5 py-2.5 text-sm font-semibold text-white"
        >
          Xem giấy in & VPP
        </Link>
        <Link
          href="/bao-gia-doanh-nghiep"
          className="rounded-lg border border-[var(--brand-primary)] px-5 py-2.5 text-sm font-semibold text-[var(--brand-primary)]"
        >
          Báo giá B2B
        </Link>
      </div>

      <div className="mt-10 rounded-[var(--radius)] border border-slate-200 bg-white p-6 text-sm">
        <h2 className="text-base font-bold">Liên hệ</h2>
        <p className="mt-2 text-[var(--brand-muted)]">
          Website:{" "}
          <a href="https://vppaca.vn" className="text-[var(--brand-primary)] hover:underline">
            vppaca.vn
          </a>
        </p>
        <p className="mt-1 font-semibold">{VPPACA_BRAND.legalName}</p>
        <p className="mt-4">
          Hotline:{" "}
          <a
            className="font-semibold text-[var(--brand-primary)]"
            href={`tel:${s.phone.replace(/\s/g, "")}`}
          >
            {s.phone}
          </a>
        </p>
        <p className="mt-2">
          Email:{" "}
          <a className="text-[var(--brand-primary)] hover:underline" href={`mailto:${s.email}`}>
            {s.email}
          </a>
        </p>
        <p className="mt-2 text-[var(--brand-muted)]">Giờ làm việc: {VPPACA_BRAND.hours}</p>
        <p className="mt-4 text-xs text-[var(--brand-muted)]">
          Cập nhật MST, địa chỉ trụ sở chính thức khi hoàn tất đăng ký kinh doanh.
        </p>
      </div>
    </div>
  );
}
