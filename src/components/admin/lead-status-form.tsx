"use client";

import { useTransition } from "react";
import { updateLeadStatusAction } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { LEAD_STATUS_OPTIONS } from "@/lib/lead-status";
import { toast } from "@/store/toast";
import type { ContactLeadStatus } from "@/lib/types";

export function LeadStatusForm({
  leadId,
  status,
}: {
  leadId: string;
  status: ContactLeadStatus;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <form
      className="inline-flex items-start gap-2"
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        startTransition(async () => {
          const res = await updateLeadStatusAction(fd);
          if (res?.ok) {
            toast.success("Cập nhật trạng thái thành công");
          } else {
            toast.error(res?.error ?? "Cập nhật thất bại");
          }
        });
      }}
    >
      <input type="hidden" name="id" value={leadId} />
      <select
        name="status"
        defaultValue={status}
        disabled={pending}
        className="min-h-9 cursor-pointer rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-sm disabled:cursor-not-allowed disabled:opacity-60"
      >
        {LEAD_STATUS_OPTIONS.map((s) => (
          <option key={s.value} value={s.value}>
            {s.label}
          </option>
        ))}
      </select>
      <Button type="submit" className="min-h-9 px-3 text-sm" disabled={pending} aria-busy={pending}>
        {pending ? "…" : "Lưu"}
      </Button>
    </form>
  );
}
