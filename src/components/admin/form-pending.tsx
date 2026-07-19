"use client";

import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";

function Spinner({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-block h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-current border-r-transparent",
        className,
      )}
      aria-hidden
    />
  );
}

/** Thin top progress bar while a parent <form> server action is pending. */
export function FormBusyBar() {
  const { pending } = useFormStatus();
  if (!pending) return null;
  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-1 overflow-hidden bg-emerald-100 md:left-60"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="h-full w-2/5 animate-[admin-indeterminate_1.1s_ease-in-out_infinite] rounded-r-full bg-[var(--brand-primary)]" />
      <span className="sr-only">Đang xử lý…</span>
    </div>
  );
}

/** Dim / lock fields while the parent form is submitting. */
export function FormBusyFence({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <div
      className={cn(
        "transition-opacity duration-200",
        pending && "pointer-events-none select-none opacity-55",
        className,
      )}
      aria-busy={pending || undefined}
    >
      {children}
    </div>
  );
}

type PendingSubmitButtonProps = React.ComponentProps<typeof Button> & {
  pendingLabel?: string;
};

export function PendingSubmitButton({
  children,
  pendingLabel = "Đang lưu…",
  className,
  disabled,
  ...props
}: PendingSubmitButtonProps) {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      disabled={pending || disabled}
      aria-busy={pending}
      className={className}
      {...props}
    >
      {pending ? (
        <>
          <Spinner />
          {pendingLabel}
        </>
      ) : (
        children
      )}
    </Button>
  );
}

/** Text-style submit (e.g. Xóa) with pending feedback. */
export function PendingTextSubmit({
  children,
  pendingLabel = "Đang xóa…",
  className,
}: {
  children: React.ReactNode;
  pendingLabel?: string;
  className?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      aria-busy={pending}
      className={cn(
        "inline-flex cursor-pointer items-center gap-1.5 text-sm text-red-600 underline disabled:cursor-not-allowed disabled:opacity-60",
        className,
      )}
    >
      {pending ? (
        <>
          <Spinner className="h-3.5 w-3.5 border-red-600/40 border-r-transparent" />
          {pendingLabel}
        </>
      ) : (
        children
      )}
    </button>
  );
}
