"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ProductCard } from "@/components/store/product-card";
import type { Product, Promotion, PromotionProduct } from "@/lib/types";

function countdownParts(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  const d = Math.floor(s / 86400);
  const h = Math.floor((s % 86400) / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return { d, h, m, sec };
}

function CountdownBox({ value, label }: { value: number; label: string }) {
  return (
    <div className="text-center">
      <span className="inline-flex min-w-[2.25rem] items-center justify-center rounded-md bg-[var(--brand-sale)] px-1.5 py-1 text-sm font-bold text-white md:min-w-[2.5rem] md:text-base">
        {String(value).padStart(2, "0")}
      </span>
      <span className="mt-0.5 block text-[10px] font-medium text-[var(--brand-muted)]">{label}</span>
    </div>
  );
}

export function FlashSaleSection({
  promotion,
  products,
  promoProducts,
}: {
  promotion: Promotion | null;
  products: Product[];
  promoProducts: PromotionProduct[];
}) {
  const [left, setLeft] = useState(0);

  useEffect(() => {
    if (!promotion) return;
    const end = new Date(promotion.ends_at).getTime();
    const tick = () => setLeft(end - Date.now());
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, [promotion]);

  if (!promotion || !products.length) return null;

  const priceMap = new Map(promoProducts.map((p) => [p.product_id, p.sale_price]));
  const { d, h, m, sec } = countdownParts(left);

  return (
    <section className="home-flash-band mt-6 p-4 md:p-5">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#f0e0a8] pb-3">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="flex items-center gap-2 text-lg font-extrabold uppercase tracking-wide text-[var(--brand-text)] md:text-xl">
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-[var(--brand-sale)]" aria-hidden />
            Siêu sale hấp dẫn
          </h2>
          <div className="flex items-end gap-1.5 md:gap-2">
            <CountdownBox value={d} label="Ngày" />
            <span className="pb-4 font-bold text-[var(--brand-sale)]">:</span>
            <CountdownBox value={h} label="Giờ" />
            <span className="pb-4 font-bold text-[var(--brand-sale)]">:</span>
            <CountdownBox value={m} label="Phút" />
            <span className="pb-4 font-bold text-[var(--brand-sale)]">:</span>
            <CountdownBox value={sec} label="Giây" />
          </div>
        </div>
        <Link
          href="/san-pham?sale=1"
          className="text-sm font-bold text-[var(--tl-header-navy)] hover:underline"
        >
          Xem tất cả →
        </Link>
      </div>
      <div className="product-grid-tl mt-4">
        {products.slice(0, 5).map((p) => (
          <ProductCard
            key={p.id}
            product={p}
            overrideSalePrice={priceMap.get(p.id) ?? p.sale_price}
          />
        ))}
      </div>
    </section>
  );
}
