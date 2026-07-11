const MESSAGES: Record<string, string> = {
  save: "Không lưu được sản phẩm. Vui lòng thử lại sau.",
  sku: "Mã SKU bị trùng — hệ thống sẽ tự tạo lại. Thử lưu lần nữa.",
  slug: "Slug URL bị trùng — hệ thống sẽ tự tạo lại. Thử lưu lần nữa.",
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
