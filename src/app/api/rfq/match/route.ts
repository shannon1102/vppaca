import { NextResponse } from "next/server";
import { vppFindProductBySku, vppGetProductCatalog, vppValidateCartLines } from "@/lib/data/vpp-data";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      lines?: { sku: string; qty: number; uom_code?: string }[];
    };
    const lines = body.lines ?? [];
    const out = [];
    for (const line of lines) {
      const product = await vppFindProductBySku(line.sku);
      if (!product) {
        out.push({
          sku: line.sku,
          qty: line.qty,
          uom_code: line.uom_code ?? "",
          product_id: null,
          name: "",
          unit_price: 0,
          matched: false,
        });
        continue;
      }
      const catalog = await vppGetProductCatalog(product);
      const uom =
        line.uom_code ||
        catalog.uoms.find((u) => u.is_default_b2b)?.code ||
        catalog.uoms[0]?.code ||
        product.base_uom_code;
      const validated = await vppValidateCartLines([
        { productId: product.id, uomCode: uom, qty: line.qty || 1 },
      ]);
      const unitPrice = validated.ok ? validated.items[0]?.unit_price ?? 0 : 0;
      out.push({
        sku: line.sku,
        qty: line.qty || 1,
        uom_code: uom,
        product_id: product.id,
        name: product.name,
        unit_price: unitPrice,
        matched: true,
      });
    }
    return NextResponse.json({ lines: out });
  } catch (e) {
    console.error("[rfq/match]", e);
    return NextResponse.json({ error: "Không xử lý được file." }, { status: 500 });
  }
}
