import type { Product, ProductPriceTier, ProductUom, PromotionProduct } from "@/lib/types";

export type ResolvedPrice = {
  unitPrice: number;
  tierLabel: string;
  lineTotal: number;
  qtyBase: number;
  factorToBase: number;
};

export function pickTier(
  tiers: ProductPriceTier[],
  uomCode: string,
  qty: number,
): ProductPriceTier | null {
  const list = tiers
    .filter((t) => t.uom_code === uomCode)
    .sort((a, b) => b.min_qty - a.min_qty);
  for (const t of list) {
    if (qty >= t.min_qty && (t.max_qty == null || qty <= t.max_qty)) return t;
  }
  return null;
}

export function applyPromotionPrice(
  baseUnitPrice: number,
  product: Product,
  promoProducts: PromotionProduct[],
): number {
  const pp = promoProducts.find((p) => p.product_id === product.id);
  if (pp?.sale_price != null) return pp.sale_price;
  return baseUnitPrice;
}

export function resolveUnitPrice(input: {
  product: Product;
  uoms: ProductUom[];
  tiers: ProductPriceTier[];
  uomCode: string;
  qty: number;
  promoProducts?: PromotionProduct[];
}): ResolvedPrice | null {
  const uom = input.uoms.find((u) => u.code === input.uomCode);
  if (!uom) return null;

  const tier = pickTier(input.tiers, input.uomCode, input.qty);
  let unitPrice = tier?.unit_price ?? input.product.sale_price ?? input.product.price;
  if (input.promoProducts?.length) {
    unitPrice = applyPromotionPrice(unitPrice, input.product, input.promoProducts);
  }

  const qtyBase = input.qty * uom.factor_to_base;
  const tierLabel = tier
    ? `${tier.min_qty}${tier.max_qty ? `–${tier.max_qty}` : "+"} ${uom.label_vi}`
    : "Giá lẻ";

  return {
    unitPrice,
    tierLabel,
    lineTotal: unitPrice * input.qty,
    qtyBase,
    factorToBase: uom.factor_to_base,
  };
}

export function cartLineKey(productId: string, uomCode: string) {
  return `${productId}::${uomCode}`;
}
