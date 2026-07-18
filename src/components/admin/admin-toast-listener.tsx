"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { toast } from "@/store/toast";

const SUCCESS_TOASTS: Record<string, string> = {
  "product-saved": "Đã lưu sản phẩm thành công.",
  "product-deleted": "Đã xóa sản phẩm.",
  "category-saved": "Đã lưu danh mục thành công.",
  "category-deleted": "Đã xóa danh mục.",
  "article-saved": "Đã lưu bài viết thành công.",
  "article-deleted": "Đã xóa bài viết.",
  "settings-saved": "Đã lưu cài đặt. Reload storefront để xem thay đổi.",
};

const ERROR_TOASTS: Record<string, string> = {
  save: "Không lưu được. Vui lòng thử lại sau.",
  sku: "Mã SKU bị trùng — hệ thống sẽ tự tạo lại. Thử lưu lần nữa.",
  slug: "Slug URL bị trùng — hệ thống sẽ tự tạo lại. Thử lưu lần nữa.",
  "1": "Email hoặc mật khẩu không đúng.",
  locked: "Đăng nhập sai quá nhiều lần. Vui lòng thử lại sau.",
};

export function AdminToastListener() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const handled = useRef<string | null>(null);

  useEffect(() => {
    const toastKey = searchParams.get("toast");
    const error = searchParams.get("error");
    const saved = searchParams.get("saved");

    if (!toastKey && !error && saved !== "1") return;

    const signature = `${toastKey}|${error}|${saved}|${searchParams.get("retry")}`;
    if (handled.current === signature) return;
    handled.current = signature;

    if (toastKey && SUCCESS_TOASTS[toastKey]) {
      toast.success(SUCCESS_TOASTS[toastKey]);
    } else if (saved === "1") {
      toast.success(SUCCESS_TOASTS["settings-saved"]);
    }

    if (error) {
      let message = ERROR_TOASTS[error] ?? ERROR_TOASTS.save;
      if (error === "locked") {
        const retry = searchParams.get("retry");
        if (retry) {
          const min = Math.max(1, Math.ceil(Number(retry) / 60));
          message = `Đăng nhập sai quá nhiều lần. Thử lại sau ${min} phút.`;
        }
      }
      toast.error(message);
    }

    const params = new URLSearchParams(searchParams.toString());
    params.delete("toast");
    params.delete("saved");
    params.delete("error");
    params.delete("retry");
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }, [searchParams, router, pathname]);

  return null;
}
