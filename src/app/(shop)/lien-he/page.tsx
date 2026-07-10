import { repo } from "@/lib/data/repository";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata = pageMetadata({
  title: "Liên hệ",
  description: "Liên hệ tư vấn thiết bị y tế — hotline, email, địa chỉ cửa hàng.",
  path: "/lien-he",
});

export default async function ContactPage() {
  const s = await repo.getSettings();
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold">Liên hệ</h1>
      <div className="mt-6 space-y-2 rounded-[var(--radius)] border border-slate-200 bg-white p-6 text-sm">
        <p>
          <strong>Hotline:</strong> {s.phone}
        </p>
        <p>
          <strong>Email:</strong> {s.email}
        </p>
        <p>
          <strong>Địa chỉ:</strong> {s.address}
        </p>
        <p>
          <strong>Zalo:</strong>{" "}
          <a className="text-[var(--brand-primary)] underline" href={s.zalo_url}>
            Chat Zalo
          </a>
        </p>
      </div>
    </div>
  );
}
