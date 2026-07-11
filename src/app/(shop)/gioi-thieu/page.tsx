import { TAM_DUC_BRAND } from "@/lib/brand-content";
import { repo } from "@/lib/data/repository";
import { pageMetadata, SEO_KEYWORDS } from "@/lib/seo/metadata";

export const metadata = pageMetadata({
  title: "Giới thiệu Thiết bị Y tế Tâm Đức | Thiết bị Y tế Hà Nội",
  description:
    "Giới thiệu Thiết bị Y tế Tâm Đức — cửa hàng thiết bị y tế Hà Nội (Hà Đông). Thiết bị y tế chính hãng, tư vấn tận tâm, giao hàng toàn quốc.",
  path: "/gioi-thieu",
  keywords: [...SEO_KEYWORDS],
});

export default async function AboutPage() {
  const s = await repo.getSettings();

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold">
        Giới thiệu {s.shop_name} — Thiết bị Y tế Hà Nội
      </h1>
      <p className="mt-4 text-lg font-medium text-[var(--brand-primary)]">{s.tagline}</p>
      <p className="mt-4 leading-relaxed text-[var(--brand-muted)]">{TAM_DUC_BRAND.aboutIntro}</p>

      <h2 className="mt-8 text-xl font-bold">
        Vì sao chọn thiết bị y tế tại Tâm Đức?
      </h2>
      <p className="mt-3 leading-relaxed text-[var(--brand-muted)]">
        Khi tìm kiếm <strong>Thiết bị Y tế</strong> hoặc{" "}
        <strong>Thiết bị Y tế Hà Nội</strong>, khách hàng cần đơn vị uy tín, tư vấn rõ ràng
        và sản phẩm chính hãng. <strong>Thiết bị Y tế Tâm Đức</strong> phục vụ gia đình và
        phòng khám tại Hà Đông, Hà Nội với đội ngũ tư vấn tận tâm.
      </p>

      <h2 className="mt-8 text-xl font-bold">Chúng tôi chuyên</h2>
      <ul className="mt-4 list-inside list-disc space-y-2 leading-relaxed">
        {TAM_DUC_BRAND.aboutServices.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>

      <p className="mt-6 leading-relaxed">{TAM_DUC_BRAND.aboutCommitment}</p>
      <p className="mt-4 leading-relaxed">
        Đặt hàng online thiết bị y tế, thanh toán chuyển khoản kèm QR — đơn giản, minh bạch.
      </p>

      <div className="mt-8 rounded-[var(--radius)] border border-slate-200 bg-white p-6 text-sm">
        <h2 className="font-semibold">Hệ thống cửa hàng thiết bị y tế Hà Đông</h2>
        <ul className="mt-4 space-y-4">
          {TAM_DUC_BRAND.branches.map((branch) => (
            <li key={branch.name}>
              <p className="font-medium">{branch.name}</p>
              <p className="text-[var(--brand-muted)]">{branch.address}</p>
            </li>
          ))}
        </ul>
        <p className="mt-4">
          Hotline thiết bị y tế:{" "}
          <a className="font-semibold text-[var(--brand-primary)]" href={`tel:${s.phone.replace(/\s/g, "")}`}>
            {s.phone}
          </a>
          {" · "}
          <a
            className="font-semibold text-[var(--brand-primary)]"
            href={`tel:${TAM_DUC_BRAND.phoneSecondary.replace(/\s/g, "")}`}
          >
            {TAM_DUC_BRAND.phoneSecondary}
          </a>
        </p>
        <p className="mt-2">
          Email:{" "}
          <a className="text-[var(--brand-primary)] hover:underline" href={`mailto:${s.email}`}>
            {s.email}
          </a>
        </p>
        <p className="mt-4 text-xs text-[var(--brand-muted)]">
          Từ khóa tìm kiếm: {TAM_DUC_BRAND.seoKeywords.join(", ")}.
        </p>
      </div>
    </div>
  );
}
