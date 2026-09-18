import { requireAdminPage } from "@/lib/require-admin";
import { vppListRfqs } from "@/lib/data/repository";

export default async function AdminRfqPage() {
  await requireAdminPage();
  const rfqs = await vppListRfqs();
  return (
    <div>
      <h1 className="text-2xl font-bold">Báo giá B2B (RFQ)</h1>
      <div className="mt-6 overflow-x-auto rounded-lg border bg-white">
        <table className="w-full min-w-[640px] text-sm">
          <thead className="bg-slate-50 text-left">
            <tr>
              <th className="px-4 py-2">Mã</th>
              <th className="px-4 py-2">Liên hệ</th>
              <th className="px-4 py-2">Công ty</th>
              <th className="px-4 py-2">Trạng thái</th>
              <th className="px-4 py-2">Ngày</th>
            </tr>
          </thead>
          <tbody>
            {rfqs.map((r) => (
              <tr key={r.id} className="border-t">
                <td className="px-4 py-2 font-mono text-xs">{r.id}</td>
                <td className="px-4 py-2">
                  {r.contact_name}
                  <br />
                  <span className="text-slate-500">{r.contact_phone}</span>
                </td>
                <td className="px-4 py-2">{r.company_name || "—"}</td>
                <td className="px-4 py-2">{r.status}</td>
                <td className="px-4 py-2 whitespace-nowrap">
                  {new Date(r.created_at).toLocaleString("vi-VN")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!rfqs.length ? (
          <p className="p-6 text-center text-slate-500">Chưa có yêu cầu báo giá.</p>
        ) : null}
      </div>
    </div>
  );
}
