import Link from "next/link";
import { adjustStockAction } from "@/app/actions";
import { requireAdminPage } from "@/lib/require-admin";
import { crmListStockMovements } from "@/lib/data/crm-store";
import { repo } from "@/lib/data/repository";
import { vppListLowStock } from "@/lib/data/repository";

const REASON_LABELS: Record<string, string> = {
  sale: "Bán hàng",
  adjustment: "Điều chỉnh",
  receive: "Nhập kho",
  return: "Trả hàng",
  cancel_order: "Hủy đơn",
};

function formatWhen(iso: string): string {
  return new Date(iso).toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" });
}

export default async function AdminInventoryPage() {
  await requireAdminPage();
  const [products, movements, lowStock] = await Promise.all([
    repo.listProducts(),
    crmListStockMovements({ limit: 40 }),
    vppListLowStock(),
  ]);
  const productMap = new Map(products.map((p) => [p.id, p]));

  return (
    <div>
      <h1 className="text-3xl font-bold">Tồn kho</h1>
      <p className="mt-2 text-sm text-[var(--brand-muted)]">
        Tồn theo đơn vị cơ sở (base UoM). Mỗi thay đổi được ghi vào sổ biến động.
      </p>

      {lowStock.length > 0 ? (
        <div className="mt-6 rounded-[var(--radius)] border border-amber-200 bg-amber-50 p-4 text-sm">
          <p className="font-semibold text-amber-900">Cảnh báo tồn thấp ({lowStock.length})</p>
          <ul className="mt-2 space-y-1 text-amber-950">
            {lowStock.slice(0, 8).map(({ product, stock, min_stock }) => (
              <li key={product.id}>
                {product.name} — còn <strong>{stock}</strong> (min {min_stock})
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="mt-8 overflow-x-auto rounded-[var(--radius)] border border-slate-200 bg-white">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b bg-slate-50 text-left text-xs uppercase text-[var(--brand-muted)]">
              <th className="px-4 py-3">SKU / Sản phẩm</th>
              <th className="px-4 py-3 text-right">Tồn (base)</th>
              <th className="px-4 py-3 text-right">Min</th>
              <th className="px-4 py-3">Điều chỉnh</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-b border-slate-100">
                <td className="px-4 py-3">
                  <Link href={`/admin/products/${p.id}`} className="font-medium text-[var(--brand-primary)]">
                    {p.name}
                  </Link>
                  <p className="text-xs text-[var(--brand-muted)]">{p.sku}</p>
                </td>
                <td className="px-4 py-3 text-right font-semibold">{p.stock}</td>
                <td className="px-4 py-3 text-right text-[var(--brand-muted)]">{p.min_stock}</td>
                <td className="px-4 py-3">
                  <form action={adjustStockAction} className="flex flex-wrap items-end gap-2">
                    <input type="hidden" name="product_id" value={p.id} />
                    <label className="text-xs">
                      +/- số lượng
                      <input
                        name="delta"
                        type="number"
                        step="1"
                        placeholder="vd. 50 hoặc -10"
                        className="mt-1 block w-28 rounded border border-slate-200 px-2 py-1"
                        required
                      />
                    </label>
                    <label className="text-xs">
                      Lý do
                      <input
                        name="note"
                        className="mt-1 block w-40 rounded border border-slate-200 px-2 py-1"
                        placeholder="Nhập kho, kiểm kê…"
                      />
                    </label>
                    <button type="submit" className="rounded bg-slate-800 px-3 py-1.5 text-xs font-semibold text-white">
                      Cập nhật
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-10">
        <h2 className="text-xl font-bold">Sổ biến động gần đây</h2>
        <div className="mt-4 overflow-x-auto rounded-[var(--radius)] border border-slate-200 bg-white">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b bg-slate-50 text-left text-xs uppercase text-[var(--brand-muted)]">
                <th className="px-4 py-3">Thời gian</th>
                <th className="px-4 py-3">Sản phẩm</th>
                <th className="px-4 py-3">Loại</th>
                <th className="px-4 py-3 text-right">Biến động</th>
                <th className="px-4 py-3 text-right">Tồn sau</th>
                <th className="px-4 py-3">Ghi chú</th>
              </tr>
            </thead>
            <tbody>
              {movements.map((m) => {
                const p = productMap.get(m.product_id);
                return (
                  <tr key={m.id} className="border-b border-slate-100">
                    <td className="px-4 py-3 whitespace-nowrap text-xs">{formatWhen(m.created_at)}</td>
                    <td className="px-4 py-3">{p?.name ?? m.product_id}</td>
                    <td className="px-4 py-3">{REASON_LABELS[m.reason] ?? m.reason}</td>
                    <td className="px-4 py-3 text-right font-medium">
                      {m.delta_base > 0 ? `+${m.delta_base}` : m.delta_base}
                    </td>
                    <td className="px-4 py-3 text-right">{m.balance_after}</td>
                    <td className="px-4 py-3 text-xs text-[var(--brand-muted)]">{m.note}</td>
                  </tr>
                );
              })}
              {!movements.length ? (
                <tr>
                  <td colSpan={6} className="px-4 py-6 text-center text-[var(--brand-muted)]">
                    Chưa có biến động — sẽ ghi khi bán, nhập hoặc hủy đơn.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
