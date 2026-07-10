import Link from "next/link";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata = pageMetadata({
  title: "Không tìm thấy trang",
  description: "Trang bạn tìm không tồn tại.",
  path: "/404",
  noindex: true,
});

export default function NotFound() {
  return (
    <div className="mx-auto max-w-lg px-4 py-20 text-center">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="mt-4 text-[var(--brand-muted)]">Trang không tồn tại hoặc đã bị gỡ.</p>
      <Link
        href="/san-pham"
        className="mt-8 inline-flex min-h-11 items-center rounded-[var(--radius)] bg-[var(--brand-primary)] px-6 text-sm font-semibold text-white"
      >
        Xem sản phẩm
      </Link>
    </div>
  );
}
