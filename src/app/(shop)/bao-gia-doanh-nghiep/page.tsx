import { RfqForm } from "@/components/store/rfq-form";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata = pageMetadata({
  title: "Báo giá doanh nghiệp B2B | VPPACA",
  description: "Upload Excel danh mục văn phòng phẩm, nhận báo giá từ ACA.",
  path: "/bao-gia-doanh-nghiep",
});

export default function RfqPage() {
  return (
    <div className="shop-container py-10">
      <h1 className="text-3xl font-bold">Báo giá doanh nghiệp (B2B)</h1>
      <p className="mt-2 text-[var(--brand-muted)]">
        Tải file Excel danh mục mã hàng — hệ thống tự ghép sản phẩm và gửi yêu cầu cho bộ phận
        kinh doanh ACA.
      </p>
      <div className="mt-8">
        <RfqForm />
      </div>
    </div>
  );
}
