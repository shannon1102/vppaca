import { NextResponse } from "next/server";
import { guardAdminApi } from "@/lib/admin-api-auth";
import { toCsv } from "@/lib/export/csv";
import { repo } from "@/lib/data/repository";

export async function POST(request: Request) {
  const denied = await guardAdminApi(request);
  if (denied) return denied;
  const products = await repo.listProducts();
  const rows = products.map((p) => ({
    sku: p.sku,
    name: p.name,
    brand: p.brand,
    price: p.price,
    sale_price: p.sale_price ?? "",
    stock_base: p.stock,
    base_uom: p.base_uom_code,
    published: p.is_published ? "yes" : "no",
  }));
  const csv = toCsv(rows);
  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="catalog-export.csv"',
    },
  });
}
