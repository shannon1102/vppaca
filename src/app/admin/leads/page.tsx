import Link from "next/link";
import { LeadStatusForm } from "@/components/admin/lead-status-form";
import { requireAdminPage } from "@/lib/require-admin";
import { repo } from "@/lib/data/repository";

const PAGE_SIZE = 20;

type Props = {
  searchParams: Promise<{ page?: string }>;
};

function formatWhen(iso: string): string {
  return new Date(iso).toLocaleString("vi-VN", {
    timeZone: "Asia/Ho_Chi_Minh",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function AdminLeadsPage({ searchParams }: Props) {
  await requireAdminPage();
  const sp = await searchParams;
  const page = Math.max(Number.parseInt(sp.page ?? "1", 10) || 1, 1);
  const { items, total } = await repo.listLeads({ page, pageSize: PAGE_SIZE });
  const totalPages = total > 0 ? Math.ceil(total / PAGE_SIZE) : 0;

  return (
    <div>
      <h1 className="text-3xl font-bold">Đăng ký tư vấn</h1>
      <p className="mt-2 text-sm text-[var(--brand-muted)]">
        {total} đăng ký · sắp xếp mới nhất trước
      </p>

      <div className="mt-6 overflow-x-auto rounded-[var(--radius)] border border-slate-200 bg-white">
        <table className="min-w-full text-sm [&_tbody_td]:align-top [&_thead_th]:align-middle">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs uppercase tracking-wide text-[var(--brand-muted)]">
              <th className="px-4 py-3 font-semibold">Thời gian</th>
              <th className="px-4 py-3 font-semibold">Họ tên</th>
              <th className="px-4 py-3 font-semibold">Điện thoại</th>
              <th className="px-4 py-3 font-semibold">Email</th>
              <th className="px-4 py-3 font-semibold">Nguồn</th>
              <th className="px-4 py-3 font-semibold">Tình trạng bệnh lý</th>
              <th className="whitespace-nowrap px-4 py-3 font-semibold">Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-[var(--brand-muted)]">
                  Chưa có đăng ký tư vấn.
                </td>
              </tr>
            ) : (
              items.map((lead) => (
                <tr key={lead.id} className="border-b border-slate-100 last:border-0">
                  <td className="whitespace-nowrap px-4 py-3 text-[var(--brand-muted)]">
                    <time dateTime={lead.created_at}>{formatWhen(lead.created_at)}</time>
                  </td>
                  <td className="px-4 py-3 font-medium">{lead.name}</td>
                  <td className="px-4 py-3">
                    <a
                      href={`tel:${lead.phone.replace(/\s/g, "")}`}
                      className="text-[var(--brand-primary)] hover:underline"
                    >
                      {lead.phone}
                    </a>
                  </td>
                  <td className="px-4 py-3 text-[var(--brand-muted)]">
                    {lead.email || "—"}
                  </td>
                  <td className="px-4 py-3 text-[var(--brand-muted)]">{lead.source || "—"}</td>
                  <td className="max-w-xs px-4 py-3 text-[var(--brand-muted)]">
                    {lead.message || "—"}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <LeadStatusForm leadId={lead.id} status={lead.status} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 ? (
        <nav
          className="mt-6 flex flex-wrap items-center justify-center gap-3 text-sm"
          aria-label="Phân trang"
        >
          {page > 1 ? (
            <Link
              href={`/admin/leads?page=${page - 1}`}
              className="rounded-lg border border-slate-200 bg-white px-4 py-2 hover:bg-slate-50"
            >
              ← Trước
            </Link>
          ) : null}
          <span className="text-[var(--brand-muted)]">
            Trang {page} / {totalPages}
          </span>
          {page < totalPages ? (
            <Link
              href={`/admin/leads?page=${page + 1}`}
              className="rounded-lg border border-slate-200 bg-white px-4 py-2 hover:bg-slate-50"
            >
              Sau →
            </Link>
          ) : null}
        </nav>
      ) : null}
    </div>
  );
}
