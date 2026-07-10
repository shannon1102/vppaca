import { AdminShell } from "@/components/admin/admin-shell";
import { isAdminAuthenticated } from "@/lib/auth-admin";

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

  return <AdminShell>{children}</AdminShell>;
}
