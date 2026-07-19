import { adminLoginAction } from "@/app/actions";
import { PendingSubmitButton } from "@/components/admin/form-pending";
import { Input } from "@/components/ui/input";
import { LOGIN_RATE_LIMIT } from "@/lib/auth/login-rate-limit";
import { isAdminAuthenticated } from "@/lib/auth-admin";
import { redirect } from "next/navigation";

function formatRetryMinutes(retrySec: number): number {
  return Math.max(1, Math.ceil(retrySec / 60));
}

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; retry?: string }>;
}) {
  if (await isAdminAuthenticated()) redirect("/admin");
  const { error, retry } = await searchParams;
  const retryMin = retry ? formatRetryMinutes(Number(retry)) : null;

  return (
    <div className="mx-auto max-w-md rounded-[var(--radius)] border border-slate-200 bg-white p-8 shadow-sm">
      <h1 className="text-2xl font-bold">Đăng nhập Admin</h1>
      <p className="mt-2 text-sm text-[var(--brand-muted)]">
        Mặc định: admintamduc / admin123 (đổi qua env)
      </p>
      {error === "locked" ? (
        <p className="mt-3 text-sm text-red-600">
          Đăng nhập sai quá {LOGIN_RATE_LIMIT.maxAttempts} lần trong{" "}
          {LOGIN_RATE_LIMIT.windowMinutes} phút. Vui lòng thử lại sau{" "}
          {retryMin ?? LOGIN_RATE_LIMIT.windowMinutes} phút.
        </p>
      ) : error ? (
        <p className="mt-3 text-sm text-red-600">Tài khoản hoặc mật khẩu không đúng.</p>
      ) : null}
      <form action={adminLoginAction} className="mt-6 space-y-4">
        <Input
          name="email"
          type="text"
          autoComplete="username"
          label="Tài khoản"
          required
          defaultValue="admintamduc"
          disabled={error === "locked"}
        />
        <Input
          name="password"
          type="password"
          label="Mật khẩu"
          required
          disabled={error === "locked"}
        />
        <PendingSubmitButton
          className="w-full"
          disabled={error === "locked"}
          pendingLabel="Đang đăng nhập…"
        >
          Đăng nhập
        </PendingSubmitButton>
      </form>
    </div>
  );
}
