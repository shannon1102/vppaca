const MESSAGES: Record<string, string> = {
  sku: "SKU đã được dùng cho sản phẩm khác. Vui lòng đổi mã SKU (ví dụ: MED-SLP-001).",
  slug: "Slug URL đã tồn tại. Vui lòng đổi slug hoặc tên sản phẩm.",
  save: "Không lưu được sản phẩm. Kiểm tra SKU/slug trùng hoặc thử lại sau.",
};

export function FormErrorBanner({ code }: { code?: string }) {
  if (!code) return null;
  const message = MESSAGES[code] ?? MESSAGES.save;
  return (
    <div
      role="alert"
      className="mt-4 rounded-[var(--radius)] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
    >
      {message}
    </div>
  );
}
