import Link from "next/link";
import { adminLogoutAction } from "@/app/actions";
import { AdminNav } from "@/components/admin/admin-nav";
import { Button } from "@/components/ui/button";

export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-slate-100 md:flex-row">
      <aside className="flex w-full shrink-0 flex-col bg-[var(--brand-secondary)] text-white md:w-60 md:min-h-screen">
        <div className="border-b border-white/10 px-5 py-5">
          <Link href="/admin" className="block">
            <span className="text-lg font-bold tracking-tight">MediStore</span>
            <span className="mt-0.5 block text-xs font-normal text-white/60">
              Quản trị
            </span>
          </Link>
        </div>
        <AdminNav />
        <div className="mt-auto hidden space-y-2 border-t border-white/10 px-3 py-4 md:block">
          <Link
            href="/"
            className="block rounded-lg px-3 py-2 text-sm text-white/70 hover:bg-white/10 hover:text-white"
          >
            ← Về storefront
          </Link>
          <form action={adminLogoutAction}>
            <Button
              type="submit"
              variant="ghost"
              className="w-full justify-start text-white/70 hover:bg-white/10 hover:text-white"
            >
              Đăng xuất
            </Button>
          </form>
        </div>
        <div className="flex items-center justify-between gap-2 border-t border-white/10 px-3 py-3 md:hidden">
          <Link href="/" className="text-sm text-white/70">
            ← Storefront
          </Link>
          <form action={adminLogoutAction}>
            <Button
              type="submit"
              variant="ghost"
              className="text-sm text-white/70 hover:bg-white/10 hover:text-white"
            >
              Đăng xuất
            </Button>
          </form>
        </div>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="border-b border-slate-200 bg-white px-6 py-4">
          <p className="text-sm text-[var(--brand-muted)]">Bảng điều khiển</p>
        </header>
        <main className="flex-1 px-6 py-8">{children}</main>
      </div>
    </div>
  );
}
