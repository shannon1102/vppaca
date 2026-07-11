import { formatVnd } from "@/lib/format";
import type { Order } from "@/lib/types";

function statusLabel(status: Order["status"]) {
  switch (status) {
    case "pending":
      return "Pending";
    case "confirmed":
      return "Confirmed";
    case "paid":
      return "Paid";
    case "shipped":
      return "Shipped";
    case "cancelled":
      return "Cancelled";
    default:
      return status;
  }
}

export function OrderSummaryCard({
  order,
  shopName,
}: {
  order: Order;
  shopName?: string;
}) {
  const when = new Date(order.created_at).toLocaleString("vi-VN", {
    timeZone: "Asia/Ho_Chi_Minh",
  });

  return (
    <div className="overflow-hidden rounded-[var(--radius)] border border-slate-200 bg-white shadow-sm">
      <div className="bg-gradient-to-br from-[var(--brand-secondary)] to-[var(--brand-primary)] px-6 py-6 text-white">
        <p className="text-xs font-semibold uppercase tracking-wider opacity-85">
          Đơn hàng
        </p>
        <h2 className="mt-1 text-2xl font-bold">
          {shopName ?? "Thông tin đơn hàng"}
        </h2>
        <p className="mt-2 text-sm opacity-95">
          Cảm ơn bạn đã đặt hàng. Shop sẽ liên hệ xác nhận sớm.
        </p>
      </div>

      <div className="p-6">
        <div className="flex flex-wrap items-start justify-between gap-4 rounded-xl border border-green-200 bg-green-50 px-5 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--brand-primary)]">
              Mã đơn
            </p>
            <p className="mt-1 text-2xl font-bold text-[var(--brand-secondary)]">
              {order.code}
            </p>
            <p className="mt-2 text-sm text-[var(--brand-muted)]">
              {when} · Trạng thái:{" "}
              <strong className="text-amber-700">{statusLabel(order.status)}</strong>
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-[var(--brand-muted)]">Tổng thanh toán</p>
            <p className="mt-1 text-2xl font-bold text-[var(--brand-primary)]">
              {formatVnd(order.total)}
            </p>
          </div>
        </div>

        <h3 className="mt-8 text-sm font-semibold uppercase tracking-wide text-[var(--brand-text)]">
          Thông tin khách hàng
        </h3>
        <dl className="mt-3 overflow-hidden rounded-xl border border-slate-200 text-sm">
          <div className="grid grid-cols-[120px_1fr] border-b border-slate-100 sm:grid-cols-[140px_1fr]">
            <dt className="bg-slate-50 px-4 py-3 text-[var(--brand-muted)]">Họ tên</dt>
            <dd className="px-4 py-3 font-semibold">{order.customer_name}</dd>
          </div>
          <div className="grid grid-cols-[120px_1fr] border-b border-slate-100 sm:grid-cols-[140px_1fr]">
            <dt className="bg-slate-50 px-4 py-3 text-[var(--brand-muted)]">Điện thoại</dt>
            <dd className="px-4 py-3">
              <a
                href={`tel:${order.customer_phone.replace(/\s/g, "")}`}
                className="font-semibold text-[var(--brand-primary)] hover:underline"
              >
                {order.customer_phone}
              </a>
            </dd>
          </div>
          <div className="grid grid-cols-[120px_1fr] border-b border-slate-100 sm:grid-cols-[140px_1fr]">
            <dt className="bg-slate-50 px-4 py-3 text-[var(--brand-muted)]">Email</dt>
            <dd className="px-4 py-3">{order.customer_email || "—"}</dd>
          </div>
          <div className="grid grid-cols-[120px_1fr] border-b border-slate-100 last:border-b-0 sm:grid-cols-[140px_1fr]">
            <dt className="bg-slate-50 px-4 py-3 text-[var(--brand-muted)]">Địa chỉ</dt>
            <dd className="px-4 py-3">{order.customer_address}</dd>
          </div>
          {order.note ? (
            <div className="grid grid-cols-[120px_1fr] sm:grid-cols-[140px_1fr]">
              <dt className="bg-slate-50 px-4 py-3 text-[var(--brand-muted)]">Ghi chú</dt>
              <dd className="px-4 py-3">{order.note}</dd>
            </div>
          ) : null}
        </dl>

        <h3 className="mt-8 text-sm font-semibold uppercase tracking-wide text-[var(--brand-text)]">
          Chi tiết sản phẩm
        </h3>
        <div className="mt-3 overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full min-w-[480px] text-sm">
            <thead className="bg-slate-50 text-left text-xs text-[var(--brand-muted)]">
              <tr>
                <th className="px-4 py-3 font-semibold">Sản phẩm</th>
                <th className="px-4 py-3 text-center font-semibold">SL</th>
                <th className="px-4 py-3 text-right font-semibold">Đơn giá</th>
                <th className="px-4 py-3 text-right font-semibold">Thành tiền</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item) => (
                <tr key={item.id} className="border-t border-slate-100">
                  <td className="px-4 py-3 text-[var(--brand-text)]">{item.name}</td>
                  <td className="px-4 py-3 text-center text-[var(--brand-muted)]">
                    {item.qty}
                  </td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    {formatVnd(item.unit_price)}
                  </td>
                  <td className="px-4 py-3 text-right font-semibold whitespace-nowrap text-[var(--brand-primary)]">
                    {formatVnd(item.unit_price * item.qty)}
                  </td>
                </tr>
              ))}
              <tr className="border-t border-slate-200 bg-slate-50/60">
                <td colSpan={3} className="px-4 py-3 text-right font-semibold">
                  Tổng cộng
                </td>
                <td className="px-4 py-3 text-right text-base font-bold text-[var(--brand-primary)]">
                  {formatVnd(order.total)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-sm text-[var(--brand-muted)]">
          Thanh toán: <strong>Chuyển khoản / thỏa thuận với shop</strong> — shop sẽ xác nhận khi liên hệ.
        </p>
      </div>
    </div>
  );
}
