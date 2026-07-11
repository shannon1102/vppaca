"use client";

import { useToastStore, type ToastKind } from "@/store/toast";

const styles: Record<ToastKind, string> = {
  success: "border-green-200 bg-green-50 text-green-900",
  error: "border-red-200 bg-red-50 text-red-900",
  info: "border-slate-200 bg-white text-[var(--brand-text)]",
};

export function ToastHost() {
  const items = useToastStore((s) => s.items);
  const dismiss = useToastStore((s) => s.dismiss);

  if (!items.length) return null;

  return (
    <div
      className="pointer-events-none fixed bottom-4 right-4 z-[100] flex w-[min(100%-2rem,22rem)] flex-col gap-2"
      aria-live="polite"
    >
      {items.map((t) => (
        <div
          key={t.id}
          className={`pointer-events-auto flex items-start gap-3 rounded-[var(--radius)] border px-4 py-3 text-sm shadow-lg ${styles[t.kind]}`}
          role="status"
        >
          <p className="min-w-0 flex-1 font-medium">{t.message}</p>
          <button
            type="button"
            onClick={() => dismiss(t.id)}
            className="cursor-pointer shrink-0 text-xs opacity-60 hover:opacity-100"
            aria-label="Đóng"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}
