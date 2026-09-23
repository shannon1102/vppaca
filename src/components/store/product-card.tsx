import Image from "next/image";
import Link from "next/link";
import { ProductCardActions } from "@/components/store/product-card-actions";
import { effectivePrice, formatVnd } from "@/lib/format";
import { catalogImageSrc } from "@/lib/media/safe-image-src";
import type { Product } from "@/lib/types";

function formatSold(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, "")}tr`;
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace(/\.0$/, "")}k`;
  return String(n);
}

function starCount(product: Product): number {
  if (product.sold_count >= 500) return 5;
  if (product.sold_count >= 100) return 4;
  return 4;
}

function Stars({ count }: { count: number }) {
  return (
    <span className="product-card-tl__stars" aria-label={`${count} sao`}>
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} className={i < count ? "text-amber-400" : "text-slate-200"}>
          ★
        </span>
      ))}
    </span>
  );
}

export function ProductCard({
  product,
  overrideSalePrice,
}: {
  product: Product;
  overrideSalePrice?: number | null;
}) {
  const sale = overrideSalePrice ?? product.sale_price;
  const price = effectivePrice(product.price, sale);
  const onSale = sale != null && sale < product.price;
  const pct =
    onSale && product.price > 0
      ? Math.round(((product.price - price) / product.price) * 100)
      : 0;
  const outOfStock = product.stock <= 0;

  return (
    <article className="product-card-tl group">
      <Link href={`/san-pham/${product.slug}`} className="product-card-tl__media-link">
        <div className="product-card-tl__media">
          <Image
            src={catalogImageSrc(product.images.find((src) => Boolean(src)))}
            alt={product.name}
            fill
            className="object-contain p-2 transition duration-300 group-hover:scale-[1.03]"
            sizes="(max-width:640px) 46vw, (max-width:1200px) 22vw, 280px"
          />
          {onSale ? (
            <span className="product-card-tl__badge-sale">-{pct}%</span>
          ) : null}
          {outOfStock ? (
            <span className="product-card-tl__badge-oos">Hết hàng</span>
          ) : null}
        </div>
      </Link>

      <div className="product-card-tl__body">
        <p className="product-card-tl__sold">Đã bán: {formatSold(product.sold_count)}</p>
        <Stars count={starCount(product)} />
        <Link href={`/san-pham/${product.slug}`} className="product-card-tl__title">
          {product.name}
        </Link>
        <div className="product-card-tl__price-row">
          <span className="product-card-tl__price">{formatVnd(price)}</span>
          {onSale ? (
            <span className="product-card-tl__price-old">{formatVnd(product.price)}</span>
          ) : null}
        </div>
        <ProductCardActions product={product} overrideSalePrice={overrideSalePrice} />
      </div>
    </article>
  );
}
