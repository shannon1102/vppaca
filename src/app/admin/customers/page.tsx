import Link from "next/link";
import { saveCustomerAction } from "@/app/actions";
import { Input } from "@/components/ui/input";
import { formatVnd } from "@/lib/format";
import { requireAdminPage } from "@/lib/require-admin";
import { crmListCustomers } from "@/lib/data/crm-store";

type Props = { searchParams: Promise<{ q?: string; page?: string }> };

export default async function AdminCustomersPage({ searchParams }: Props) {
  await requireAdminPage();
  const sp = await searchParams;
  const page = Math.max(Number.parseInt(sp.page ?? "1", 10) || 1, 1);
  const { items, total } = await crmListCustomers({ q: sp.q, page, pageSize: 25 });
  const totalPages = total > 0 ? Math.ceil(total / 25) : 0;

  return (
    <div>
      <h1 className="text-3xl font-bold">CRM — Khách hàng</h1>
      <p className="mt-2 text-sm text-[var(--brand-muted)]">
        Hồ sơ KH tự gắn khi có đơn hàng (theo SĐT). {total} khách hàng.
      </p>

      <form className="mt-6 flex flex-wrap gap-2" method="get">
        <input
          name="q"
          defaultValue={sp.q ?? ""}
          placeholder="Tìm tên, SĐT, công ty, MST…"
          className="min-w-[220px] flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm"
        />
        <button
          type="submit"
          className="rounded-lg bg-[var(--brand-primary)] px-4 py-2 text-sm font-semibold text-white"
        >
          Tìm
        </button>
      </form>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 overflow-x-auto rounded-[var(--radius)] border border-slate-200 bg-white">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b bg-slate-50 text-left text-xs uppercase text-[var(--brand-muted)]">
                <th className="px-4 py-3">Khách hàng</th>
                <th className="px-4 py-3">Liên hệ</th>
                <th className="px-4 py-3">Loại</th>
                <th className="px-4 py-3 text-right">Công nợ</th>
              </tr>
            </thead>
            <tbody>
              {items.map((c) => (
                <tr key={c.id} className="border-b border-slate-100 hover:bg-slate-50/80">
                  <td className="px-4 py-3">
                    <Link href={`/admin/customers/${c.id}`} className="font-semibold text-[var(--brand-primary)]">
                      {c.name}
                    </Link>
                    {c.company ? (
                      <p className="text-xs text-[var(--brand-muted)]">{c.company}</p>
                    ) : null}
                  </td>
                  <td className="px-4 py-3">
                    <p>{c.phone}</p>
                    {c.email ? <p className="text-xs text-[var(--brand-muted)]">{c.email}</p> : null}
                  </td>
                  <td className="px-4 py-3 uppercase text-xs">{c.customer_type}</td>
                  <td className="px-4 py-3 text-right font-medium">{formatVnd(c.debt_balance)}</td>
                </tr>
              ))}
              {!items.length ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-[var(--brand-muted)]">
                    Chưa có khách hàng — thêm thủ công hoặc đặt hàng trên web.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>

        <form
          action={saveCustomerAction}
          className="h-fit space-y-3 rounded-[var(--radius)] border border-slate-200 bg-white p-5"
        >
          <h2 className="font-semibold">Thêm khách hàng</h2>
          <Input name="name" label="Họ tên *" required />
          <Input name="phone" label="SĐT *" required />
          <Input name="email" label="Email" />
          <Input name="company" label="Công ty" />
          <Input name="tax_code" label="MST" />
          <Input name="address" label="Địa chỉ" />
          <label className="block text-sm">
            <span className="mb-1 block font-medium">Loại</span>
            <select name="customer_type" defaultValue="b2c" className="w-full rounded-lg border border-slate-200 px-3 py-2">
              <option value="b2c">B2C</option>
              <option value="b2b">B2B</option>
            </select>
          </label>
          <button type="submit" className="w-full rounded-lg bg-[var(--brand-primary)] py-2.5 text-sm font-semibold text-white">
            Lưu khách hàng
          </button>
        </form>
      </div>

      {totalPages > 1 ? (
        <div className="mt-6 flex gap-2 text-sm">
          {page > 1 ? (
            <Link href={`/admin/customers?page=${page - 1}&q=${sp.q ?? ""}`} className="underline">
              ← Trước
            </Link>
          ) : null}
          <span className="text-[var(--brand-muted)]">
            Trang {page}/{totalPages}
          </span>
          {page < totalPages ? (
            <Link href={`/admin/customers?page=${page + 1}&q=${sp.q ?? ""}`} className="underline">
              Sau →
            </Link>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
