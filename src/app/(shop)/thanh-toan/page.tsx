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
import { toast } from "@/store/toast";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, total } = useCart();
  const [error, setError] = useState<string | null>(null);
  const [needVat, setNeedVat] = useState(false);
  const [pending, startTransition] = useTransition();

  const itemsJson = useMemo(
    () =>
      JSON.stringify(
        items.map((i) => ({
          productId: i.productId,
          uomCode: i.uomCode,
          qty: i.qty,
        })),
      ),
    [items],
  );

  if (items.length === 0) {
    return (
      <div className="shop-container py-16">
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
    <div className="shop-container grid gap-8 py-10 md:grid-cols-5">
      <div className="md:col-span-3">
        <h1 className="text-3xl font-bold">Thanh toán</h1>
        <p className="mt-2 text-sm text-[var(--brand-muted)]">
          Chuyển khoản / VietQR sau khi đặt hàng. Giá được xác nhận lại trên hệ thống.
        </p>
        <form
          className="mt-8 space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            startTransition(async () => {
              try {
                const res = await placeOrderAction(fd);
                if (res && "error" in res && res.error) {
                  setError(res.error);
                  toast.error(res.error);
                  return;
                }
                if (res && "code" in res && res.code) {
                  toast.success("Đặt hàng thành công");
                  router.push(`/dat-hang-thanh-cong/${res.code}`);
                  return;
                }
                toast.error("Không tạo được đơn hàng. Vui lòng thử lại.");
              } catch {
                toast.error("Đặt hàng thất bại. Vui lòng thử lại.");
              }
            });
          }}
        >
          <input type="hidden" name="items_json" value={itemsJson} />
          <Input name="customer_name" label="Họ và tên *" required />
          <Input name="customer_phone" label="Số điện thoại *" required />
          <Input name="customer_email" type="email" label="Email" />
          <Input name="customer_address" label="Địa chỉ nhận hàng *" required />
          <label className="flex items-center gap-2 text-sm">
            <select
              name="customer_type"
              className="rounded-lg border border-slate-200 px-3 py-2"
              defaultValue="b2c"
            >
              <option value="b2c">Khách lẻ (B2C)</option>
              <option value="b2b">Doanh nghiệp (B2B)</option>
            </select>
          </label>
          <label className="flex items-center gap-2 text-sm font-medium">
            <input
              type="checkbox"
              name="need_vat_invoice"
              checked={needVat}
              onChange={(e) => setNeedVat(e.target.checked)}
            />
            Xuất hóa đơn VAT
          </label>
          {needVat ? (
            <div className="space-y-3 rounded-lg border border-amber-200 bg-amber-50/50 p-4">
              <Input name="vat_company_name" label="Tên công ty *" required={needVat} />
              <Input name="vat_tax_code" label="Mã số thuế *" required={needVat} />
              <Input name="vat_address" label="Địa chỉ đăng ký thuế *" required={needVat} />
              <Input name="vat_email" type="email" label="Email nhận hóa đơn *" required={needVat} />
            </div>
          ) : null}
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
          <h2 className="font-bold">Tóm tắt</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {items.map((i) => (
              <li key={`${i.productId}-${i.uomCode}`} className="flex justify-between gap-2">
                <span className="line-clamp-2">
                  {i.name} × {i.qty} ({i.uomLabel})
                </span>
                <span className="shrink-0 font-medium">{formatVnd(i.price * i.qty)}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 border-t pt-4 text-lg font-bold">
            Tổng tạm tính: {formatVnd(total())}
          </p>
          <p className="mt-2 text-xs text-[var(--brand-muted)]">
            Giá cuối cùng áp dụng theo bậc số lượng khi xác nhận đơn.
          </p>
        </div>
      </aside>
    </div>
  );
}
