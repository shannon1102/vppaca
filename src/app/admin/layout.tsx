import { AdminShell } from "@/components/admin/admin-shell";
import { isAdminAuthenticated } from "@/lib/auth-admin";
import { repo } from "@/lib/data/repository";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const ok = await isAdminAuthenticated();

  if (!ok) {
    return (
      <div className="min-h-screen bg-slate-100">
        <div className="mx-auto max-w-lg px-4 py-16">{children}</div>
      </div>
    );
  }

  // Soft-fail settings so a slow DB never blocks the whole admin shell
  let shopName = "Tâm Đức";
  try {
    const settings = await repo.getSettings();
    if (settings.shop_name?.trim()) shopName = settings.shop_name;
  } catch {
    /* keep fallback */
  }

  return <AdminShell shopName={shopName}>{children}</AdminShell>;
}
