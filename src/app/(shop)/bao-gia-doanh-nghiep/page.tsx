import { RfqForm } from "@/components/store/rfq-form";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata = pageMetadata({
  title: "Báo giá doanh nghiệp B2B | VPPACA",
  description: "Upload Excel danh mục văn phòng phẩm, nhận báo giá từ ACA.",
  path: "/bao-gia-doanh-nghiep",
});

export default function RfqPage() {
  return (
    <div className="shop-container px-4 py-10 sm:px-6 md:py-14">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold">Báo giá doanh nghiệp (B2B)</h1>
        <p className="mt-3 text-[var(--brand-muted)]">
          Tải file Excel danh mục mã hàng — hệ thống tự ghép sản phẩm và gửi yêu cầu cho bộ phận
          kinh doanh ACA.
        </p>
        <div className="mt-10">
          <RfqForm />
        </div>
      </div>
    </div>
  );
}
