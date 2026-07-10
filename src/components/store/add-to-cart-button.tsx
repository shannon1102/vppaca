"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { effectivePrice, formatVnd } from "@/lib/format";
import type { Product } from "@/lib/types";
import { useCart } from "@/store/cart";

export function AddToCartButton({ product }: { product: Product }) {
  const add = useCart((s) => s.add);
  const router = useRouter();
  return (
    <div className="flex flex-wrap gap-3">
      <Button
        type="button"
        onClick={() => {
          add({
            productId: product.id,
            name: product.name,
            slug: product.slug,
            image: product.images[0] ?? "/seed/product-01.svg",
            price: effectivePrice(product.price, product.sale_price),
          });
        }}
      >
        Thêm vào giỏ
      </Button>
      <Button
        type="button"
        variant="secondary"
        onClick={() => {
          add({
            productId: product.id,
            name: product.name,
            slug: product.slug,
            image: product.images[0] ?? "/seed/product-01.svg",
            price: effectivePrice(product.price, product.sale_price),
          });
          router.push("/gio-hang");
        }}
      >
        Mua ngay — {formatVnd(effectivePrice(product.price, product.sale_price))}
      </Button>
    </div>
  );
}
