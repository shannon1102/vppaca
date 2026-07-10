import { adminLoginAction } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { isAdminAuthenticated } from "@/lib/auth-admin";
import { redirect } from "next/navigation";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  if (await isAdminAuthenticated()) redirect("/admin");
  const { error } = await searchParams;

  return (
    <div className="mx-auto max-w-md rounded-[var(--radius)] border border-slate-200 bg-white p-8 shadow-sm">
      <h1 className="text-2xl font-bold">Đăng nhập Admin</h1>
      <p className="mt-2 text-sm text-[var(--brand-muted)]">
        Mặc định: admin@medistore.vn / admin123 (đổi qua env)
      </p>
      {error ? (
        <p className="mt-3 text-sm text-red-600">Email hoặc mật khẩu không đúng.</p>
      ) : null}
      <form action={adminLoginAction} className="mt-6 space-y-4">
        <Input
          name="email"
          type="email"
          label="Email"
          required
          defaultValue="admin@medistore.vn"
        />
        <Input name="password" type="password" label="Mật khẩu" required />
        <Button type="submit" className="w-full">
          Đăng nhập
        </Button>
      </form>
    </div>
  );
}
