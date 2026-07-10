import Link from "next/link";
import { formatVnd } from "@/lib/format";
import type { HealthArticle, Order, OrderStatus, Product } from "@/lib/types";

const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "Chờ xử lý",
  confirmed: "Đã xác nhận",
  paid: "Đã thanh toán",
  shipped: "Đã giao",
  cancelled: "Đã hủy",
};

const STATUS_COLORS: Record<OrderStatus, string> = {
  pending: "bg-amber-500",
  confirmed: "bg-blue-500",
  paid: "bg-emerald-500",
  shipped: "bg-teal-600",
  cancelled: "bg-slate-400",
};

function startOfDay(d: Date): Date {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function last7Days(): { key: string; label: string }[] {
  const days: { key: string; label: string }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push({
      key: startOfDay(d).toISOString().slice(0, 10),
      label: d.toLocaleDateString("vi-VN", { weekday: "short", day: "numeric" }),
    });
  }
  return days;
}

type Props = {
  products: Product[];
  orders: Order[];
  articles: HealthArticle[];
  shopName: string;
};

export function DashboardStats({ products, orders, articles, shopName }: Props) {
  const publishedProducts = products.filter((p) => p.is_published).length;
  const pendingOrders = orders.filter((o) => o.status === "pending").length;
  const totalRevenue = orders.reduce((s, o) => s + o.total, 0);
  const publishedArticles = articles.filter((a) => a.is_published).length;
  const lowStock = products.filter((p) => p.stock <= 5).length;

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthOrders = orders.filter((o) => new Date(o.created_at) >= monthStart);
  const monthRevenue = monthOrders.reduce((s, o) => s + o.total, 0);

  const dayKeys = last7Days();
  const revenueByDay = dayKeys.map(({ key }) => {
    const total = orders
      .filter((o) => o.created_at.slice(0, 10) === key)
      .reduce((s, o) => s + o.total, 0);
    return total;
  });
  const maxRevenue = Math.max(...revenueByDay, 1);

  const statuses: OrderStatus[] = [
    "pending",
    "confirmed",
    "paid",
    "shipped",
    "cancelled",
  ];
  const statusCounts = statuses.map((s) => ({
    status: s,
    count: orders.filter((o) => o.status === s).length,
  }));
  const maxStatusCount = Math.max(...statusCounts.map((x) => x.count), 1);

  return (
    <div>
      <h1 className="text-3xl font-bold">Tổng quan</h1>
      <p className="mt-2 text-sm text-[var(--brand-muted)]">Shop: {shopName}</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          label="Sản phẩm"
          value={String(products.length)}
          sub={`${publishedProducts} đã xuất bản`}
        />
        <StatCard
          label="Đơn hàng"
          value={String(orders.length)}
          sub={`${pendingOrders} chờ xử lý`}
        />
        <StatCard label="Doanh thu (tất cả)" value={formatVnd(totalRevenue)} />
        <StatCard
          label="Bài viết SK"
          value={String(articles.length)}
          sub={`${publishedArticles} đã xuất bản`}
        />
        <StatCard
          label="Sắp hết hàng"
          value={String(lowStock)}
          sub="Tồn kho ≤ 5"
        />
        <StatCard
          label="Đơn tháng này"
          value={String(monthOrders.length)}
          sub={formatVnd(monthRevenue)}
        />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-[var(--radius)] bg-white p-5 shadow-sm">
          <h2 className="font-semibold">Doanh thu 7 ngày gần nhất</h2>
          <div className="mt-6 flex h-44 items-end gap-2">
            {dayKeys.map(({ key, label }, i) => {
              const amount = revenueByDay[i];
              const pct = (amount / maxRevenue) * 100;
              return (
                <div key={key} className="flex min-w-0 flex-1 flex-col items-center gap-1">
                  <span className="text-[10px] text-[var(--brand-muted)]">
                    {amount > 0 ? formatVnd(amount).replace(/\s/g, "") : ""}
                  </span>
                  <div
                    className="w-full rounded-t bg-[var(--brand-primary)] transition-all"
                    style={{ height: `${Math.max(pct, amount > 0 ? 4 : 0)}%` }}
                    title={formatVnd(amount)}
                  />
                  <span className="truncate text-[10px] text-[var(--brand-muted)]">
                    {label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-[var(--radius)] bg-white p-5 shadow-sm">
          <h2 className="font-semibold">Đơn hàng theo trạng thái</h2>
          <ul className="mt-6 space-y-3">
            {statusCounts.map(({ status, count }) => (
              <li key={status}>
                <div className="mb-1 flex justify-between text-sm">
                  <span>{STATUS_LABELS[status]}</span>
                  <span className="font-medium">{count}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className={`h-full rounded-full ${STATUS_COLORS[status]}`}
                    style={{ width: `${(count / maxStatusCount) * 100}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap gap-3 text-sm">
        <QuickLink href="/admin/products">Quản lý sản phẩm</QuickLink>
        <QuickLink href="/admin/products/new">Thêm sản phẩm mới</QuickLink>
        <QuickLink href="/admin/orders">Xem đơn hàng</QuickLink>
        {pendingOrders > 0 ? (
          <QuickLink href="/admin/orders">Đơn chờ ({pendingOrders})</QuickLink>
        ) : null}
        <QuickLink href="/admin/branding">Branding / white-label</QuickLink>
        <QuickLink href="/admin/articles">Bài viết sức khỏe</QuickLink>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="rounded-[var(--radius)] bg-white p-5 shadow-sm">
      <p className="text-sm text-[var(--brand-muted)]">{label}</p>
      <p className="mt-2 text-2xl font-bold">{value}</p>
      {sub ? <p className="mt-1 text-xs text-[var(--brand-muted)]">{sub}</p> : null}
    </div>
  );
}

function QuickLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      className="rounded-full border border-slate-200 bg-white px-4 py-2 text-[var(--brand-primary)] hover:bg-slate-50"
      href={href}
    >
      {children}
    </Link>
  );
}
