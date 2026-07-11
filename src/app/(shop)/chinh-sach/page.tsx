import { pageMetadata, SEO_KEYWORDS } from "@/lib/seo/metadata";

export const metadata = pageMetadata({
  title: "Chính sách bán hàng thiết bị y tế | Tâm Đức",
  description:
    "Chính sách đặt hàng, thanh toán, giao hàng và đổi trả thiết bị y tế tại Thiết bị Y tế Tâm Đức — Hà Nội.",
  path: "/chinh-sach",
  keywords: [...SEO_KEYWORDS],
});

export default function PolicyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 prose prose-slate">
      <h1 className="text-3xl font-bold">Chính sách bán hàng</h1>
      <ul className="mt-6 list-disc space-y-2 pl-5 text-sm leading-relaxed text-[var(--brand-muted)]">
        <li>Đặt hàng trên website, thanh toán chuyển khoản theo QR / số tài khoản.</li>
        <li>Đơn hàng được xác nhận sau khi shop nhận được chuyển khoản đúng nội dung.</li>
        <li>Giao hàng toàn quốc; phí ship báo trước khi gửi.</li>
        <li>Đổi trả theo tình trạng sản phẩm trong 7 ngày (còn tem, chưa sử dụng).</li>
      </ul>
    </div>
  );
}
