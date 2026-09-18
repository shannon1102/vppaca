import { requireAdminPage } from "@/lib/require-admin";
import { vppListAllBanners } from "@/lib/data/repository";

export default async function AdminBannersPage() {
  await requireAdminPage();
  const banners = await vppListAllBanners();
  return (
    <div>
      <h1 className="text-2xl font-bold">Banner & strip</h1>
      <p className="mt-2 text-sm text-slate-600">
        Chỉnh sửa qua Supabase hoặc Admin API <code>/api/admin/banners</code>. Seed mặc định từ
        catalog VPP.
      </p>
      <ul className="mt-6 space-y-3">
        {banners.map((b) => (
          <li key={b.id} className="rounded-lg border bg-white p-4 text-sm">
            <p className="font-semibold">{b.title || b.id}</p>
            <p className="text-slate-500">
              {b.placement} · sort {b.sort} · {b.is_active ? "active" : "off"}
            </p>
            <p className="truncate text-xs">{b.image_url}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
