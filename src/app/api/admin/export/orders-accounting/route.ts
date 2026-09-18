import { NextResponse } from "next/server";
import { guardAdminApi } from "@/lib/admin-api-auth";
import { toCsv } from "@/lib/export/csv";
import { repo } from "@/lib/data/repository";

export async function POST(request: Request) {
  const denied = await guardAdminApi(request);
  if (denied) return denied;
  const orders = await repo.listOrders();
  const rows = orders.flatMap((o) =>
    o.items.map((item) => ({
      order_code: o.code,
      order_date: o.created_at,
      customer_name: o.customer_name,
      customer_phone: o.customer_phone,
      need_vat: o.need_vat_invoice ? "yes" : "no",
      vat_company: o.vat_company_name,
      vat_tax_code: o.vat_tax_code,
      vat_address: o.vat_address,
      vat_email: o.vat_email,
      product_name: item.name,
      sku_qty: item.qty,
      unit_price: item.unit_price,
      line_total: item.unit_price * item.qty,
      uom: item.uom_code,
      order_total: o.total,
    })),
  );
  const csv = toCsv(rows);
  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="orders-accounting.csv"',
    },
  });
}
