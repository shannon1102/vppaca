import { TAM_DUC_BRAND } from "@/lib/brand-content";
import { repo } from "@/lib/data/repository";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata = pageMetadata({
  title: "Liên hệ",
  description:
    "Liên hệ Thiết bị Y tế Tâm Đức — hotline, email, hệ thống 2 cơ sở tại Hà Đông, Hà Nội.",
  path: "/lien-he",
});

function telHref(phone: string) {
  return `tel:${phone.replace(/\s/g, "")}`;
}

export default async function ContactPage() {
  const s = await repo.getSettings();
  const branchWithMap = TAM_DUC_BRAND.branches.find((b) => b.embedUrl);

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-3xl font-bold">Liên hệ</h1>
      <p className="mt-2 text-[var(--brand-muted)]">
        Tư vấn miễn phí — hỗ trợ chọn thiết bị y tế phù hợp nhu cầu gia đình và phòng khám.
      </p>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <div className="rounded-[var(--radius)] border border-slate-200 bg-white p-6 text-sm">
          <h2 className="font-semibold">Hotline</h2>
          <div className="mt-3 space-y-2">
            <p>
              <a
                className="text-lg font-bold text-[var(--brand-primary)] hover:underline"
                href={telHref(s.phone)}
              >
                {s.phone}
              </a>
              <span className="ml-2 text-xs text-[var(--brand-muted)]">(chính)</span>
            </p>
            <p>
              <a
                className="font-semibold text-[var(--brand-primary)] hover:underline"
                href={telHref(TAM_DUC_BRAND.phoneSecondary)}
              >
                {TAM_DUC_BRAND.phoneSecondary}
              </a>
            </p>
          </div>

          <h2 className="mt-6 font-semibold">Email</h2>
          <p className="mt-2">
            <a className="text-[var(--brand-primary)] hover:underline" href={`mailto:${s.email}`}>
              {s.email}
            </a>
          </p>

          <h2 className="mt-6 font-semibold">Giờ làm việc</h2>
          <p className="mt-2">{TAM_DUC_BRAND.hours}</p>

          <h2 className="mt-6 font-semibold">Zalo</h2>
          <p className="mt-2">
            <a className="text-[var(--brand-primary)] underline" href={s.zalo_url}>
              Chat Zalo — {s.phone}
            </a>
          </p>
        </div>

        <div className="space-y-4">
          {TAM_DUC_BRAND.branches.map((branch) => (
            <div
              key={branch.name}
              className="rounded-[var(--radius)] border border-slate-200 bg-white p-6 text-sm"
            >
              <h2 className="font-semibold">{branch.name}</h2>
              <p className="mt-2 text-[var(--brand-muted)]">{branch.address}</p>
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
        </div>
      </div>

      {branchWithMap?.embedUrl ? (
        <div className="mt-8 overflow-hidden rounded-[var(--radius)] border border-slate-200">
          <iframe
            title="Bản đồ cơ sở Làng Việt Kiều"
            src={branchWithMap.embedUrl}
            className="h-80 w-full"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>
      ) : null}
    </div>
  );
}
