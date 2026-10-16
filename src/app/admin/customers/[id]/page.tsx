import Link from "next/link";
import { notFound } from "next/navigation";
import { addCustomerNoteAction, saveCustomerAction } from "@/app/actions";
import { Input } from "@/components/ui/input";
import { formatVnd } from "@/lib/format";
import { requireAdminPage } from "@/lib/require-admin";
import { crmGetCustomer, crmListCustomerNotes } from "@/lib/data/crm-store";
import { repo } from "@/lib/data/repository";

type Props = { params: Promise<{ id: string }> };

function formatWhen(iso: string): string {
  return new Date(iso).toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" });
}

export default async function AdminCustomerDetailPage({ params }: Props) {
  await requireAdminPage();
  const { id } = await params;
  const customer = await crmGetCustomer(id);
  if (!customer) notFound();

  const [notes, orders] = await Promise.all([
    crmListCustomerNotes(id),
    repo.listOrders(),
  ]);
  const customerOrders = orders.filter(
    (o) => o.customer_id === id || o.customer_phone === customer.phone,
  );

  return (
    <div>
      <Link href="/admin/customers" className="text-sm text-[var(--brand-primary)] underline">
        ← Danh sách KH
      </Link>
      <h1 className="mt-2 text-3xl font-bold">{customer.name}</h1>
      <p className="text-sm text-[var(--brand-muted)]">
        {customer.phone} · Cập nhật {formatWhen(customer.updated_at)}
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <form action={saveCustomerAction} className="space-y-3 rounded-[var(--radius)] border border-slate-200 bg-white p-5">
          <h2 className="font-semibold">Hồ sơ</h2>
          <input type="hidden" name="id" value={customer.id} />
          <Input name="name" label="Họ tên" defaultValue={customer.name} required />
          <Input name="phone" label="SĐT" defaultValue={customer.phone} required />
          <Input name="email" label="Email" defaultValue={customer.email} />
          <Input name="company" label="Công ty" defaultValue={customer.company} />
          <Input name="tax_code" label="MST" defaultValue={customer.tax_code} />
          <Input name="address" label="Địa chỉ" defaultValue={customer.address} />
          <label className="block text-sm">
            <span className="mb-1 block font-medium">Loại</span>
            <select
              name="customer_type"
              defaultValue={customer.customer_type}
              className="w-full rounded-lg border border-slate-200 px-3 py-2"
            >
              <option value="b2c">B2C</option>
              <option value="b2b">B2B</option>
            </select>
          </label>
          <Input name="note" label="Ghi chú nội bộ" defaultValue={customer.note} />
          <p className="text-sm">
            Công nợ hiện tại: <strong>{formatVnd(customer.debt_balance)}</strong>
          </p>
          <button type="submit" className="rounded-lg bg-[var(--brand-primary)] px-4 py-2 text-sm font-semibold text-white">
            Lưu hồ sơ
          </button>
        </form>

        <div className="space-y-6">
          <form action={addCustomerNoteAction} className="space-y-3 rounded-[var(--radius)] border border-slate-200 bg-white p-5">
            <h2 className="font-semibold">Ghi chú CRM</h2>
            <input type="hidden" name="customer_id" value={customer.id} />
            <textarea
              name="body"
              required
              rows={3}
              placeholder="Gọi lại, báo giá, hẹn giao…"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
            />
            <button type="submit" className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold">
              Thêm ghi chú
            </button>
          </form>

          <div className="rounded-[var(--radius)] border border-slate-200 bg-white p-5">
            <h2 className="font-semibold">Lịch sử ghi chú</h2>
            <ul className="mt-3 space-y-2 text-sm">
              {notes.map((n) => (
                <li key={n.id} className="rounded-lg bg-slate-50 px-3 py-2">
                  <p>{n.body}</p>
                  <p className="mt-1 text-xs text-[var(--brand-muted)]">{formatWhen(n.created_at)}</p>
                </li>
              ))}
              {!notes.length ? (
                <li className="text-[var(--brand-muted)]">Chưa có ghi chú.</li>
              ) : null}
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-10">
        <h2 className="text-xl font-bold">Đơn hàng liên quan</h2>
        <ul className="mt-4 space-y-2">
          {customerOrders.map((o) => (
            <li key={o.id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm">
              <div>
                <Link href={`/admin/orders/${o.id}`} className="font-semibold text-[var(--brand-primary)]">
                  {o.code}
                </Link>
                <span className="ml-2 text-[var(--brand-muted)]">{formatWhen(o.created_at)}</span>
              </div>
              <span className="font-semibold">{formatVnd(o.total)}</span>
            </li>
          ))}
          {!customerOrders.length ? (
            <li className="text-sm text-[var(--brand-muted)]">Chưa có đơn.</li>
          ) : null}
        </ul>
      </div>
    </div>
  );
}
