import Link from "next/link";
import { formatVnd } from "@/lib/format";
import { requireAdminPage } from "@/lib/require-admin";
import { crmListInvoices } from "@/lib/data/crm-store";
import { repo } from "@/lib/data/repository";

function formatWhen(iso: string): string {
  return new Date(iso).toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" });
}

export default async function AdminInvoicesPage() {
  await requireAdminPage();
  const [invoices, settings] = await Promise.all([crmListInvoices(50), repo.getSettings()]);

  return (
    <div>
      <h1 className="text-3xl font-bold">Hóa đơn VAT (PDF)</h1>
      <p className="mt-2 max-w-2xl text-sm text-[var(--brand-muted)]">
        Phát hành PDF nội bộ / đối soát kế toán. Hóa đơn điện tử hợp lệ với cơ quan thuế phải qua
        cổng TCT. Cấu hình người bán tại{" "}
        <Link href="/admin/branding" className="text-[var(--brand-primary)] underline">
          Branding
        </Link>
        .
      </p>

      <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm">
        <p>
          Ký hiệu: <strong>{settings.vat_invoice_series}</strong> · Số tiếp theo:{" "}
          <strong>{settings.vat_invoice_next_number}</strong> · Thuế suất mặc định:{" "}
          <strong>{settings.vat_default_rate}%</strong>
          {settings.vat_prices_include_tax ? " (giá đã gồm VAT)" : " (giá chưa VAT)"}
        </p>
      </div>

      <div className="mt-8 overflow-x-auto rounded-[var(--radius)] border border-slate-200 bg-white">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b bg-slate-50 text-left text-xs uppercase text-[var(--brand-muted)]">
              <th className="px-4 py-3">Số HĐ</th>
              <th className="px-4 py-3">Ngày</th>
              <th className="px-4 py-3">Người mua</th>
              <th className="px-4 py-3 text-right">Tổng</th>
              <th className="px-4 py-3">Đơn hàng</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((inv) => (
              <tr key={inv.id} className="border-b border-slate-100">
                <td className="px-4 py-3 font-mono text-xs">{inv.invoice_number}</td>
                <td className="px-4 py-3">{formatWhen(inv.issued_at)}</td>
                <td className="px-4 py-3">{inv.buyer_name}</td>
                <td className="px-4 py-3 text-right font-semibold">{formatVnd(inv.total_inc_vat)}</td>
                <td className="px-4 py-3">
                  <Link href={`/admin/orders/${inv.order_id}`} className="text-[var(--brand-primary)] underline">
                    Xem đơn
                  </Link>
                  {" · "}
                  <a
                    href={`/api/admin/invoices/vat/${inv.order_id}`}
                    className="text-[var(--brand-primary)] underline"
                  >
                    Tải lại PDF
                  </a>
                </td>
              </tr>
            ))}
            {!invoices.length ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-[var(--brand-muted)]">
                  Chưa phát hành HĐ — mở chi tiết đơn và bấm &quot;Xuất PDF hóa đơn VAT&quot;.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
