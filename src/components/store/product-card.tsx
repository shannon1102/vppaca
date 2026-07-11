import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { effectivePrice, formatVnd } from "@/lib/format";
import type { Product } from "@/lib/types";

export function ProductCard({ product }: { product: Product }) {
  const price = effectivePrice(product.price, product.sale_price);
  const onSale = product.sale_price != null && product.sale_price < product.price;
  return (
    <Link
      href={`/san-pham/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-[var(--radius)] border border-slate-200 bg-[var(--brand-surface)] shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="relative aspect-square overflow-hidden bg-slate-100">
        <Image
          src={product.images[0] ?? "/seed/product-01.svg"}
          alt={product.name}
          fill
          className="object-cover transition duration-300 group-hover:scale-105"
          sizes="(max-width:768px) 50vw, 25vw"
        />
        {onSale ? (
          <div className="absolute left-3 top-3">
            <Badge>Giảm giá</Badge>
          </div>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <p className="line-clamp-2 text-sm font-semibold text-[var(--brand-text)]">
          {product.name}
        </p>
        <p className="text-xs text-[var(--brand-muted)]">{product.sku}</p>
        <p className="text-xs text-[var(--brand-muted)]">Đã bán {product.sold_count}</p>
        <div className="mt-auto flex items-baseline gap-2">
          <span className="text-base font-bold text-[var(--brand-primary)]">
            {formatVnd(price)}
          </span>
          {onSale ? (
            <span className="text-xs text-[var(--brand-muted)] line-through">
              {formatVnd(product.price)}
            </span>
          ) : null}
        </div>
      </div>
    </Link>
  );
}
