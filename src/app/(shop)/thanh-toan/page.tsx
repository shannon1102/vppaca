"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import { placeOrderAction } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty";
import { Input } from "@/components/ui/input";
import { formatVnd } from "@/lib/format";
import { useCart } from "@/store/cart";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, total } = useCart();
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const itemsJson = useMemo(
    () =>
      JSON.stringify(
        items.map((i) => ({
          productId: i.productId,
          name: i.name,
          qty: i.qty,
          unit_price: i.price,
        })),
      ),
    [items],
  );

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <EmptyState
          title="Chưa có sản phẩm để thanh toán"
          action={
            <Link href="/san-pham">
              <Button>Quay lại cửa hàng</Button>
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="mx-auto grid max-w-5xl gap-8 px-4 py-10 md:grid-cols-5">
      <div className="md:col-span-3">
        <h1 className="text-3xl font-bold">Thanh toán</h1>
        <p className="mt-2 text-sm text-[var(--brand-muted)]">
          Đặt hàng — thanh toán chuyển khoản thủ công (có QR sau khi đặt).
        </p>
        <form
          className="mt-8 space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            startTransition(async () => {
              const res = await placeOrderAction(fd);
              if (res && "error" in res && res.error) {
                setError(res.error);
                return;
              }
              if (res && "code" in res && res.code) {
                router.push(`/dat-hang-thanh-cong/${res.code}`);
              }
            });
          }}
        >
          <input type="hidden" name="items_json" value={itemsJson} />
          <Input name="customer_name" label="Họ và tên *" required />
          <Input name="customer_phone" label="Số điện thoại *" required />
          <Input name="customer_email" type="email" label="Email" />
          <Input name="customer_address" label="Địa chỉ nhận hàng *" required />
          <label className="block space-y-1.5 text-sm">
            <span className="font-medium">Ghi chú</span>
            <textarea
              name="note"
              rows={3}
              className="w-full rounded-[var(--radius)] border border-slate-200 px-3 py-2 outline-none ring-[var(--brand-primary)] focus:ring-2"
            />
          </label>
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          <Button type="submit" disabled={pending}>
            {pending ? "Đang xử lý..." : "Đặt hàng"}
          </Button>
        </form>
      </div>
      <aside className="md:col-span-2">
        <div className="rounded-[var(--radius)] border border-slate-200 bg-white p-5">
          <h2 className="font-semibold">Đơn hàng</h2>
          <ul className="mt-4 space-y-3 text-sm">
            {items.map((i) => (
              <li key={i.productId} className="flex justify-between gap-3">
                <span>
                  {i.name} × {i.qty}
                </span>
                <span className="font-medium">{formatVnd(i.price * i.qty)}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 border-t border-slate-100 pt-4 text-lg font-bold">
            Tổng: {formatVnd(total())}
          </p>
        </div>
      </aside>
    </div>
  );
}
