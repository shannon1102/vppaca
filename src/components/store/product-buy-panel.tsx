"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { formatVnd } from "@/lib/format";
import { resolveUnitPrice } from "@/lib/pricing";
import type { ProductCatalog, PromotionProduct } from "@/lib/types";
import { lineKey, useCart } from "@/store/cart";
import { toast } from "@/store/toast";

export function ProductBuyPanel({
  catalog,
  promoProducts = [],
}: {
  catalog: ProductCatalog;
  promoProducts?: PromotionProduct[];
}) {
  const add = useCart((s) => s.add);
  const router = useRouter();
  const defaultUom =
    catalog.uoms.find((u) => u.is_default_b2c) ?? catalog.uoms[0];
  const [uomCode, setUomCode] = useState(defaultUom?.code ?? "cai");
  const [qty, setQty] = useState(1);

  const resolved = useMemo(() => {
    if (!catalog.uoms.length) return null;
    return resolveUnitPrice({
      product: catalog,
      uoms: catalog.uoms,
      tiers: catalog.tiers,
      uomCode,
      qty,
      promoProducts,
    });
  }, [catalog, uomCode, qty, promoProducts]);

  const uomLabel = catalog.uoms.find((u) => u.code === uomCode)?.label_vi ?? uomCode;

  const addToCart = () => {
    if (!resolved) return;
    add(
      {
        productId: catalog.id,
        uomCode,
        name: catalog.name,
        slug: catalog.slug,
        image: catalog.images[0] ?? "/seed/product-01.svg",
        price: resolved.unitPrice,
        factorToBase: resolved.factorToBase,
        uomLabel,
      },
      qty,
    );
    toast.success("Đã thêm vào giỏ hàng");
  };

  return (
    <div className="space-y-4">
      {catalog.uoms.length > 1 ? (
        <div>
          <p className="text-sm font-medium">Đơn vị mua</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {catalog.uoms.map((u) => (
              <button
                key={u.code}
                type="button"
                onClick={() => setUomCode(u.code)}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                  uomCode === u.code
                    ? "border-[var(--brand-sale)] bg-[var(--brand-sale)]/10 text-[var(--brand-sale)]"
                    : "border-slate-200 hover:border-[var(--brand-primary)]"
                }`}
              >
                {u.label_vi}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {catalog.tiers.filter((t) => t.uom_code === uomCode).length ? (
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm">
          <p className="font-semibold">Giá theo số lượng ({uomLabel})</p>
          <ul className="mt-2 space-y-1 text-[var(--brand-muted)]">
            {catalog.tiers
              .filter((t) => t.uom_code === uomCode)
              .sort((a, b) => a.min_qty - b.min_qty)
              .map((t) => (
                <li key={t.id}>
                  Mua {t.min_qty}
                  {t.max_qty ? `–${t.max_qty}` : "+"}: {formatVnd(t.unit_price)}/{uomLabel}
                </li>
              ))}
          </ul>
        </div>
      ) : null}

      <div className="flex items-center gap-3">
        <span className="text-sm font-medium">Số lượng</span>
        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-lg border"
          onClick={() => setQty((q) => Math.max(1, q - 1))}
        >
          −
        </button>
        <span className="w-8 text-center font-bold">{qty}</span>
        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-lg border"
          onClick={() => setQty((q) => q + 1)}
        >
          +
        </button>
      </div>

      {resolved ? (
        <p className="text-2xl font-bold text-[var(--brand-sale)]">
          {formatVnd(resolved.unitPrice)}
          <span className="ml-2 text-sm font-normal text-[var(--brand-muted)]">
            / {uomLabel} · {resolved.tierLabel}
          </span>
        </p>
      ) : null}

      <div className="flex flex-wrap gap-3">
        <Button type="button" onClick={addToCart}>
          Thêm vào giỏ
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={() => {
            addToCart();
            router.push("/gio-hang");
          }}
        >
          Mua ngay
        </Button>
        <Link
          href="/bao-gia-doanh-nghiep"
          className="inline-flex min-h-11 items-center justify-center rounded-[var(--radius)] px-4 text-sm font-semibold text-[var(--brand-primary)] hover:underline"
        >
          Báo giá doanh nghiệp
        </Link>
      </div>
    </div>
  );
}
