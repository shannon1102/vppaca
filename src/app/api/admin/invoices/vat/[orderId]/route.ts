import { NextResponse } from "next/server";
import { guardAdminApi } from "@/lib/admin-api-auth";
import { repo } from "@/lib/data/repository";
import { crmIssueVatInvoice } from "@/lib/data/crm-store";
import { buildVatInvoicePdf } from "@/lib/invoices/vat-pdf";

type Params = { params: Promise<{ orderId: string }> };

export async function GET(request: Request, { params }: Params) {
  const denied = await guardAdminApi(request);
  if (denied) return denied;

  const { orderId } = await params;
  const order = await repo.getOrderById(orderId);
  if (!order) {
    return NextResponse.json({ error: "Không tìm thấy đơn hàng." }, { status: 404 });
  }

  const settings = await repo.getSettings();
  const invoice = await crmIssueVatInvoice(order, settings);
  const pdf = await buildVatInvoicePdf(invoice, order, settings);

  return new NextResponse(Buffer.from(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="HDDT-${invoice.invoice_number}.pdf"`,
      "Cache-Control": "no-store",
    },
  });
}
