import { updateOrderStatusAction } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { formatVnd } from "@/lib/format";
import { requireAdminPage } from "@/lib/require-admin";
import { repo } from "@/lib/data/repository";
import type { OrderStatus } from "@/lib/types";

const statuses: { value: OrderStatus; label: string }[] = [
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "paid", label: "Paid" },
  { value: "shipped", label: "Shipped" },
  { value: "cancelled", label: "Cancelled" },
];

export default async function AdminOrdersPage() {
  await requireAdminPage();
  const orders = await repo.listOrders();

  return (
    <div>
      <h1 className="text-3xl font-bold">Orders</h1>
      <div className="mt-6 space-y-4">
        {orders.length === 0 ? (
          <p className="text-sm text-[var(--brand-muted)]">No orders yet.</p>
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
                  <p className="mt-1 text-xs uppercase tracking-wide text-[var(--brand-muted)]">
                    Status: <span className="font-semibold text-[var(--brand-text)]">{o.status}</span>
                  </p>
                </div>
                <form
                  action={updateOrderStatusAction}
                  className="relative z-10 flex items-center gap-2"
                >
                  <input type="hidden" name="id" value={o.id} />
                  <select
                    name="status"
                    defaultValue={o.status}
                    className="min-h-11 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
                  >
                    {statuses.map((s) => (
                      <option key={s.value} value={s.value}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                  <Button type="submit" className="min-h-11 px-4">
                    Update
                  </Button>
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
