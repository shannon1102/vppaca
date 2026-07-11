"use client";

import { useTransition } from "react";
import { updateOrderStatusAction } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { ORDER_STATUS_OPTIONS } from "@/lib/order-status";
import { toast } from "@/store/toast";
import type { OrderStatus } from "@/lib/types";

export function OrderStatusForm({
  orderId,
  status,
}: {
  orderId: string;
  status: OrderStatus;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <form
      className="relative z-10 flex items-center gap-2"
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        startTransition(async () => {
          const res = await updateOrderStatusAction(fd);
          if (res?.ok) {
            toast.success("Cập nhật trạng thái đơn hàng thành công");
          } else {
            toast.error(res?.error ?? "Cập nhật đơn hàng thất bại");
          }
        });
      }}
    >
      <input type="hidden" name="id" value={orderId} />
      <select
        name="status"
        defaultValue={status}
        disabled={pending}
        className="min-h-11 cursor-pointer rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-60"
      >
        {ORDER_STATUS_OPTIONS.map((s) => (
          <option key={s.value} value={s.value}>
            {s.label}
          </option>
        ))}
      </select>
      <Button type="submit" className="min-h-11 px-4" disabled={pending}>
        {pending ? "Đang lưu..." : "Cập nhật"}
      </Button>
    </form>
  );
}
