"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ProductCard } from "@/components/store/product-card";
import type { Product, Promotion, PromotionProduct } from "@/lib/types";

function formatCountdown(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
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

  return (
    <section className="mt-6 overflow-hidden rounded-xl bg-gradient-to-r from-[#EE4D2D] to-[#ff7337] p-4 text-white shadow-md">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold uppercase tracking-wide">{promotion.name}</h2>
          <p className="text-sm text-white/90">Kết thúc sau {formatCountdown(left)}</p>
        </div>
        <Link href="/san-pham?sale=1" className="text-sm font-semibold underline">
          Xem tất cả
        </Link>
      </div>
      <div className="product-grid-shopee mt-4">
        {products.slice(0, 6).map((p) => (
          <div key={p.id} className="rounded-lg bg-white p-1">
            <ProductCard
              product={p}
              overrideSalePrice={priceMap.get(p.id) ?? p.sale_price}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
