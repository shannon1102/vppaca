import {
  articleLimitMessage,
  productLimitMessage,
} from "@/lib/catalog-limits";

const MESSAGES: Record<string, string> = {
  save: "Không lưu được. Kiểm tra ảnh đã upload xong và nội dung không quá lớn (~4MB).",
  sku: "Mã SKU bị trùng — hệ thống sẽ tự tạo lại. Thử lưu lần nữa.",
  slug: "Slug URL bị trùng — hệ thống sẽ tự tạo lại. Thử lưu lần nữa.",
  "product-limit": productLimitMessage(),
  "article-limit": articleLimitMessage(),
  payload:
    "Dữ liệu gửi lên quá lớn (HTTP 413). Ảnh phải upload riêng qua nút Image — không dán ảnh base64 vào form.",
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
