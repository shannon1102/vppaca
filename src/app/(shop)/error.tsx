"use client";

export default function ShopError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="shop-container py-16 text-center">
      <h1 className="text-2xl font-bold">Không tải được trang</h1>
      <p className="mt-2 text-sm text-[var(--brand-muted)]">
        Kết nối dữ liệu tạm thời gián đoạn. Vui lòng thử lại.
      </p>
      <button
        type="button"
        onClick={() => reset()}
        className="mt-6 inline-flex min-h-11 items-center rounded-[var(--radius)] bg-[var(--brand-primary)] px-6 text-sm font-semibold text-white"
      >
        Thử lại
      </button>
    </div>
  );
}
