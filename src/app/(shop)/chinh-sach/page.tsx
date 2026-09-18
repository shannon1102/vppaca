import Link from "next/link";

import { VPPACA_BRAND } from "@/lib/brand-content";
import { pageMetadata, SEO_KEYWORDS } from "@/lib/seo/metadata";

export const metadata = pageMetadata({
  title: "Chính sách bán hàng | VPPACA",
  description:
    "Chính sách đặt hàng, thanh toán, giao hàng, đổi trả và VAT khi mua văn phòng phẩm tại VPPACA (ACA).",
  path: "/chinh-sach",
  keywords: [...SEO_KEYWORDS, "chính sách văn phòng phẩm", "đổi trả VPP"],
});

export default function PolicyPage() {
  return (
    <div className="shop-container max-w-3xl py-12">
      <h1 className="text-3xl font-bold">Chính sách bán hàng VPPACA</h1>
      <p className="mt-3 leading-relaxed text-[var(--brand-muted)]">
        Áp dụng cho giao dịch mua văn phòng phẩm trên website{" "}
        <Link href="/" className="text-[var(--brand-primary)] hover:underline">
          vppaca.vn
        </Link>{" "}
        — {VPPACA_BRAND.legalName}.
      </p>

      <div className="mt-10 space-y-8">
        {VPPACA_BRAND.salesPolicies.map((section) => (
          <section key={section.title}>
            <h2 className="text-lg font-bold text-[var(--brand-text)]">{section.title}</h2>
            <p className="mt-3 text-sm leading-relaxed text-[var(--brand-muted)]">{section.body}</p>
          </section>
        ))}
      </div>

      <p className="mt-10 text-sm text-[var(--brand-muted)]">
        Cần hỗ trợ thêm? Xem{" "}
        <Link href="/gioi-thieu" className="text-[var(--brand-primary)] hover:underline">
          Giới thiệu
        </Link>{" "}
        hoặc{" "}
        <Link href="/lien-he" className="text-[var(--brand-primary)] hover:underline">
          Liên hệ
        </Link>
        .
      </p>
    </div>
  );
}
