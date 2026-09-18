"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty";
import { formatVnd } from "@/lib/format";
import { lineKey, useCart } from "@/store/cart";

export default function CartPage() {
  const { items, setQty, remove, total } = useCart();

  if (items.length === 0) {
    return (
      <div className="shop-container py-16">
        <EmptyState
          title="Giỏ hàng trống"
          description="Hãy thêm sản phẩm để tiếp tục đặt hàng."
          action={
            <Link href="/san-pham">
              <Button>Xem sản phẩm</Button>
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="shop-container py-10">
      <h1 className="text-3xl font-bold">Giỏ hàng</h1>
      <ul className="mt-8 space-y-4">
        {items.map((item) => {
          const key = lineKey(item);
          return (
            <li
              key={key}
              className="flex flex-col gap-4 rounded-[var(--radius)] border border-slate-200 bg-white p-4 sm:flex-row sm:items-center"
            >
              <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                <Image src={item.image} alt={item.name} fill className="object-cover" sizes="80px" />
              </div>
              <div className="flex-1">
                <Link
                  href={`/san-pham/${item.slug}`}
                  className="font-semibold hover:text-[var(--brand-primary)]"
                >
                  {item.name}
                </Link>
                <p className="mt-1 text-xs text-[var(--brand-muted)]">ĐVT: {item.uomLabel}</p>
                <p className="mt-1 text-sm text-[var(--brand-sale)]">{formatVnd(item.price)}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="flex h-11 w-11 items-center justify-center rounded-lg border"
                  onClick={() => setQty(key, item.qty - 1)}
                >
                  −
                </button>
                <span className="w-8 text-center font-semibold">{item.qty}</span>
                <button
                  type="button"
                  className="flex h-11 w-11 items-center justify-center rounded-lg border"
                  onClick={() => setQty(key, item.qty + 1)}
                >
                  +
                </button>
              </div>
              <div className="text-right">
                <p className="font-bold">{formatVnd(item.price * item.qty)}</p>
                <button
                  type="button"
                  className="mt-1 text-sm text-red-600"
                  onClick={() => remove(key)}
                >
                  Xóa
                </button>
              </div>
            </li>
          );
        })}
      </ul>
      <div className="mt-8 flex flex-col items-end gap-4 border-t border-slate-200 pt-6">
        <p className="text-xl font-bold">
          Tổng: <span className="text-[var(--brand-sale)]">{formatVnd(total())}</span>
        </p>
        <Link href="/thanh-toan">
          <Button>Mua hàng</Button>
        </Link>
      </div>
    </div>
  );
}
