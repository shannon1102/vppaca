"use client";

import { useRouter } from "next/navigation";
import { effectivePrice } from "@/lib/format";
import type { Product } from "@/lib/types";
import { useCart } from "@/store/cart";
import { toast } from "@/store/toast";

export function ProductCardActions({
  product,
  overrideSalePrice,
}: {
  product: Product;
  overrideSalePrice?: number | null;
}) {
  const add = useCart((s) => s.add);
  const router = useRouter();
  const price = effectivePrice(product.price, overrideSalePrice ?? product.sale_price);

  function addOne(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    add({
      productId: product.id,
      uomCode: product.base_uom_code || "cai",
      name: product.name,
      slug: product.slug,
      image: product.images[0] ?? "/seed/product-01.svg",
      price,
      factorToBase: 1,
      uomLabel: product.base_uom_code || "cái",
    });
    toast.success("Đã thêm vào giỏ hàng");
  }

  function buyNow(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    add({
      productId: product.id,
      uomCode: product.base_uom_code || "cai",
      name: product.name,
      slug: product.slug,
      image: product.images[0] ?? "/seed/product-01.svg",
      price,
      factorToBase: 1,
      uomLabel: product.base_uom_code || "cái",
    });
    router.push("/gio-hang");
  }

  return (
    <div className="product-card-tl__actions">
      <button type="button" className="product-card-tl__btn product-card-tl__btn--outline" onClick={addOne}>
        THÊM VÀO GIỎ
      </button>
      <button type="button" className="product-card-tl__btn product-card-tl__btn--primary" onClick={buyNow}>
        MUA NGAY
      </button>
    </div>
  );
}
