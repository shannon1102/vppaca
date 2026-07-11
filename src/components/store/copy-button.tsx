"use client";

import { toast } from "@/store/toast";

export function CopyButton({ value }: { value: string }) {
  return (
    <button
      type="button"
      className="cursor-pointer rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-[var(--brand-text)] hover:bg-slate-200"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
          toast.success("Đã sao chép");
        } catch {
          toast.error("Không sao chép được");
        }
      }}
    >
      Copy
    </button>
  );
}
