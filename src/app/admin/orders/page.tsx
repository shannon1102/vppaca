import { OrderStatusForm } from "@/components/admin/order-status-form";
import { formatVnd } from "@/lib/format";
import { ORDER_STATUS_LABELS } from "@/lib/order-status";
import { requireAdminPage } from "@/lib/require-admin";
import { repo } from "@/lib/data/repository";

export default async function AdminOrdersPage() {
  await requireAdminPage();
  const orders = await repo.listOrders();

  return (
    <div>
      <h1 className="text-3xl font-bold">Đơn hàng</h1>
      <div className="mt-6 space-y-4">
        {orders.length === 0 ? (
          <p className="text-sm text-[var(--brand-muted)]">Chưa có đơn.</p>
        ) : (
          orders.map((o) => (
            <article
              key={o.id}
              className="relative z-0 rounded-[var(--radius)] border border-slate-200 bg-white p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-bold">{o.code}</p>
                  <p className="text-sm text-[var(--brand-muted)]">
                    {o.customer_name} · {o.customer_phone}
                  </p>
                  <p className="mt-1 text-sm">{o.customer_address}</p>
                  <p className="mt-2 font-semibold text-[var(--brand-primary)]">
                    {formatVnd(o.total)}
                  </p>
                  <p className="mt-1 text-xs text-[var(--brand-muted)]">
                    Trạng thái:{" "}
                    <span className="font-semibold text-[var(--brand-text)]">
                      {ORDER_STATUS_LABELS[o.status]}
                    </span>
                  </p>
                </div>
                <OrderStatusForm orderId={o.id} status={o.status} />
              </div>
              <ul className="mt-3 text-sm text-[var(--brand-muted)]">
                {o.items.map((i) => (
                  <li key={i.id}>
                    {i.name} × {i.qty}
                  </li>
                ))}
              </ul>
            </article>
          ))
        )}
      </div>
    </div>
  );
}
