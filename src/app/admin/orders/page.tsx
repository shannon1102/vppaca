import { updateOrderStatusAction } from "@/app/actions";
import { formatVnd } from "@/lib/format";
import { requireAdminPage } from "@/lib/require-admin";
import { repo } from "@/lib/data/repository";
import type { OrderStatus } from "@/lib/types";

const statuses: OrderStatus[] = [
  "pending",
  "confirmed",
  "paid",
  "shipped",
  "cancelled",
];

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
              className="rounded-[var(--radius)] border border-slate-200 bg-white p-5"
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
                </div>
                <form action={updateOrderStatusAction} className="flex items-center gap-2">
                  <input type="hidden" name="id" value={o.id} />
                  <select
                    name="status"
                    defaultValue={o.status}
                    className="rounded-lg border border-slate-200 px-2 py-2 text-sm"
                  >
                    {statuses.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                  <button
                    type="submit"
                    className="rounded-lg bg-[var(--brand-primary)] px-3 py-2 text-sm text-white"
                  >
                    Cập nhật
                  </button>
                </form>
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
