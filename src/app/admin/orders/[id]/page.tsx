import Link from "next/link";
import { notFound } from "next/navigation";
import { OrderStatusForm } from "@/components/admin/order-status-form";
import { formatVnd } from "@/lib/format";
import { ORDER_STATUS_LABELS } from "@/lib/order-status";
import { requireAdminPage } from "@/lib/require-admin";
import { crmGetInvoiceByOrder } from "@/lib/data/crm-store";
import { repo } from "@/lib/data/repository";

type Props = { params: Promise<{ id: string }> };

function formatWhen(iso: string): string {
  return new Date(iso).toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" });
}

export default async function AdminOrderDetailPage({ params }: Props) {
  await requireAdminPage();
  const { id } = await params;
  const order = await repo.getOrderById(id);
  if (!order) notFound();

  const invoice = await crmGetInvoiceByOrder(order.id);

  return (
    <div>
      <Link href="/admin/orders" className="text-sm text-[var(--brand-primary)] underline">
        ← Danh sách đơn
      </Link>
      <div className="mt-2 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">{order.code}</h1>
          <p className="text-sm text-[var(--brand-muted)]">{formatWhen(order.created_at)}</p>
        </div>
        <OrderStatusForm orderId={order.id} status={order.status} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <section className="rounded-[var(--radius)] border border-slate-200 bg-white p-5">
          <h2 className="font-semibold">Khách hàng</h2>
          <p className="mt-2">{order.customer_name}</p>
          <p className="text-sm">{order.customer_phone}</p>
          <p className="text-sm text-[var(--brand-muted)]">{order.customer_address}</p>
          {order.customer_id ? (
            <Link
              href={`/admin/customers/${order.customer_id}`}
              className="mt-2 inline-block text-sm text-[var(--brand-primary)] underline"
            >
              Mở hồ sơ CRM
            </Link>
          ) : null}
        </section>

        <section className="rounded-[var(--radius)] border border-slate-200 bg-white p-5">
          <h2 className="font-semibold">VAT & kế toán</h2>
          <p className="mt-2 text-sm">
            Trạng thái:{" "}
            <strong>{order.need_vat_invoice ? "Cần xuất HĐ VAT" : "Không yêu cầu VAT"}</strong>
          </p>
          {order.need_vat_invoice ? (
            <ul className="mt-2 text-sm text-[var(--brand-muted)]">
              <li>{order.vat_company_name}</li>
              <li>MST: {order.vat_tax_code}</li>
              <li>{order.vat_address}</li>
              <li>{order.vat_email}</li>
            </ul>
          ) : null}
          <div className="mt-4 flex flex-wrap gap-2">
            <a
              href={`/api/admin/invoices/vat/${order.id}`}
              className="rounded-lg bg-[var(--brand-primary)] px-4 py-2 text-sm font-semibold text-white"
            >
              {invoice ? "Tải lại PDF hóa đơn VAT" : "Xuất PDF hóa đơn VAT"}
            </a>
            {invoice ? (
              <span className="self-center text-xs text-[var(--brand-muted)]">
                Đã phát hành: {invoice.invoice_number}
              </span>
            ) : null}
          </div>
        </section>
      </div>

      <section className="mt-6 rounded-[var(--radius)] border border-slate-200 bg-white p-5">
        <h2 className="font-semibold">Chi tiết hàng</h2>
        <table className="mt-4 w-full text-sm">
          <thead>
            <tr className="border-b text-left text-xs uppercase text-[var(--brand-muted)]">
              <th className="py-2">Sản phẩm</th>
              <th className="py-2">SL</th>
              <th className="py-2">ĐVT</th>
              <th className="py-2 text-right">Đơn giá</th>
              <th className="py-2 text-right">Thành tiền</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((i) => (
              <tr key={i.id} className="border-b border-slate-100">
                <td className="py-2">{i.name}</td>
                <td className="py-2">{i.qty}</td>
                <td className="py-2">{i.uom_code || "—"}</td>
                <td className="py-2 text-right">{formatVnd(i.unit_price)}</td>
                <td className="py-2 text-right font-medium">{formatVnd(i.unit_price * i.qty)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mt-4 text-right text-lg font-bold text-[var(--brand-primary)]">
          Tổng: {formatVnd(order.total)}
        </p>
        <p className="text-right text-sm text-[var(--brand-muted)]">
          Trạng thái đơn: {ORDER_STATUS_LABELS[order.status]}
        </p>
      </section>
    </div>
  );
}
