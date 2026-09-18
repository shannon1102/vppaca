import { requireAdminPage } from "@/lib/require-admin";

export default async function AdminExportsPage() {
  await requireAdminPage();
  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold">Xuất dữ liệu</h1>
      <p className="text-sm text-slate-600">
        Export phục vụ kế toán (VAT) và upload catalog lên sàn TMĐT thủ công.
      </p>
      <div className="space-y-3">
        <form action="/api/admin/export/orders-accounting" method="post">
          <button
            type="submit"
            className="rounded-lg bg-[var(--brand-primary)] px-4 py-2 text-sm font-semibold text-white"
          >
            Tải CSV đơn hàng (kế toán)
          </button>
        </form>
        <form action="/api/admin/export/catalog" method="post">
          <button
            type="submit"
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold"
          >
            Tải CSV catalog (Shopee/TikTok)
          </button>
        </form>
      </div>
      <p className="text-xs text-slate-500">
        Cần đăng nhập admin trong cùng trình duyệt để tải file (session cookie).
      </p>
    </div>
  );
}
