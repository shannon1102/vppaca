import { repo } from "@/lib/data/repository";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata = pageMetadata({
  title: "Giới thiệu",
  description: "Giới thiệu cửa hàng thiết bị y tế — uy tín, chính hãng, giao hàng toàn quốc.",
  path: "/gioi-thieu",
});

export default async function AboutPage() {
  const s = await repo.getSettings();
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold">Giới thiệu {s.shop_name}</h1>
      <p className="mt-4 leading-relaxed text-[var(--brand-muted)]">{s.tagline}</p>
      <p className="mt-4 leading-relaxed">
        Chúng tôi cung cấp thiết bị y tế cho gia đình, phòng khám và cơ sở chăm sóc sức khỏe.
        Đặt hàng online, thanh toán chuyển khoản kèm QR — đơn giản, minh bạch.
      </p>
      <p className="mt-4 text-sm">
        Địa chỉ: {s.address}
        <br />
        Hotline: {s.phone}
        <br />
        Email: {s.email}
      </p>
    </div>
  );
}
