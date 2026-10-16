import { PDFDocument, rgb } from "pdf-lib";
import type { Order, SiteSettings, VatInvoice, VatInvoiceLine } from "@/lib/types";
import { amountInWordsVnd, formatVndInvoice } from "@/lib/invoices/vat-math";
import { getNotoSansBold, getNotoSansRegular } from "@/lib/invoices/vat-pdf-font";

const PAGE_W = 595.28;
const PAGE_H = 841.89;
const M = 40;

function drawText(
  page: ReturnType<PDFDocument["addPage"]>,
  font: Awaited<ReturnType<PDFDocument["embedFont"]>>,
  text: string,
  x: number,
  y: number,
  size: number,
  color = rgb(0.1, 0.1, 0.12),
) {
  page.drawText(text, { x, y, size, font, color });
}

function wrapText(text: string, maxChars: number): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let line = "";
  for (const w of words) {
    const next = line ? `${line} ${w}` : w;
    if (next.length > maxChars) {
      if (line) lines.push(line);
      line = w;
    } else {
      line = next;
    }
  }
  if (line) lines.push(line);
  return lines.length ? lines : [""];
}

export async function buildVatInvoicePdf(
  invoice: VatInvoice,
  order: Order,
  settings: SiteSettings,
): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  const fontReg = await doc.embedFont(await getNotoSansRegular());
  const fontBold = await doc.embedFont(await getNotoSansBold());
  const page = doc.addPage([PAGE_W, PAGE_H]);

  let y = PAGE_H - M;

  drawText(page, fontBold, settings.shop_name.toUpperCase(), M, y, 11);
  y -= 14;
  const sellerName = settings.vat_seller_legal_name || settings.shop_name;
  drawText(page, fontReg, sellerName, M, y, 9);
  y -= 12;
  if (settings.vat_seller_tax_code) {
    drawText(page, fontReg, `MST: ${settings.vat_seller_tax_code}`, M, y, 9);
    y -= 12;
  }
  drawText(page, fontReg, settings.vat_seller_address || settings.address, M, y, 9);
  y -= 12;
  drawText(page, fontReg, `ĐT: ${settings.phone} · ${settings.email}`, M, y, 9);

  drawText(page, fontBold, "HÓA ĐƠN GIÁ TRỊ GIA TĂNG", PAGE_W / 2 - 95, PAGE_H - M - 8, 14);
  drawText(page, fontReg, "(Bản thể hiện — phục vụ kế toán nội bộ)", PAGE_W / 2 - 88, PAGE_H - M - 26, 8, rgb(0.4, 0.4, 0.45));

  y = PAGE_H - M - 52;
  drawText(page, fontReg, `Ký hiệu: ${settings.vat_invoice_series}`, M, y, 9);
  drawText(page, fontReg, `Số: ${invoice.invoice_number}`, M + 200, y, 9);
  drawText(
    page,
    fontReg,
    `Ngày: ${new Date(invoice.issued_at).toLocaleDateString("vi-VN")}`,
    M + 380,
    y,
    9,
  );
  y -= 16;
  drawText(page, fontReg, `Mã đơn hàng: ${order.code}`, M, y, 9);

  y -= 22;
  drawText(page, fontBold, "Người mua hàng", M, y, 10);
  y -= 14;
  drawText(page, fontReg, invoice.buyer_name, M, y, 9);
  y -= 12;
  if (invoice.buyer_tax_code) {
    drawText(page, fontReg, `MST: ${invoice.buyer_tax_code}`, M, y, 9);
    y -= 12;
  }
  if (invoice.buyer_address) {
    for (const line of wrapText(invoice.buyer_address, 90)) {
      drawText(page, fontReg, line, M, y, 9);
      y -= 11;
    }
  }
  if (invoice.buyer_email) {
    drawText(page, fontReg, `Email HĐ: ${invoice.buyer_email}`, M, y, 9);
    y -= 12;
  }

  y -= 8;
  const colX = [M, M + 24, M + 220, M + 268, M + 318, M + 388, M + 448, M + 508];
  const headers = ["STT", "Tên hàng hóa", "ĐVT", "SL", "Đơn giá", "Thành tiền", "Thuế", "Tổng"];
  page.drawRectangle({
    x: M,
    y: y - 4,
    width: PAGE_W - M * 2,
    height: 18,
    color: rgb(0.93, 0.95, 0.98),
  });
  headers.forEach((h, i) => drawText(page, fontBold, h, colX[i], y, 7.5));
  y -= 20;

  invoice.line_items.forEach((line: VatInvoiceLine, idx) => {
    if (y < 120) return;
    drawText(page, fontReg, String(idx + 1), colX[0], y, 8);
    const nameLines = wrapText(line.name, 28).slice(0, 2);
    drawText(page, fontReg, nameLines[0] ?? "", colX[1], y, 8);
    drawText(page, fontReg, line.unit, colX[2], y, 8);
    drawText(page, fontReg, String(line.qty), colX[3], y, 8);
    drawText(page, fontReg, formatVndInvoice(line.unit_price_ex_vat), colX[4], y, 8);
    drawText(page, fontReg, formatVndInvoice(line.line_ex_vat), colX[5], y, 8);
    drawText(page, fontReg, formatVndInvoice(line.vat_amount), colX[6], y, 8);
    drawText(page, fontReg, formatVndInvoice(line.line_inc_vat), colX[7], y, 8);
    if (nameLines[1]) {
      y -= 11;
      drawText(page, fontReg, nameLines[1], colX[1], y, 8);
    }
    y -= 14;
  });

  y -= 6;
  page.drawLine({
    start: { x: M, y },
    end: { x: PAGE_W - M, y },
    thickness: 0.5,
    color: rgb(0.75, 0.78, 0.82),
  });
  y -= 16;

  const totals: [string, string][] = [
    ["Cộng tiền hàng (chưa thuế)", formatVndInvoice(invoice.subtotal_ex_vat)],
    [`Thuế GTGT (${invoice.vat_rate}%)`, formatVndInvoice(invoice.vat_amount)],
    ["Tổng cộng tiền thanh toán", formatVndInvoice(invoice.total_inc_vat)],
  ];
  for (const [label, value] of totals) {
    drawText(page, fontReg, label, M + 280, y, 9);
    drawText(page, fontBold, value, M + 430, y, 9);
    y -= 14;
  }

  y -= 6;
  for (const line of wrapText(`Bằng chữ: ${amountInWordsVnd(invoice.total_inc_vat)}`, 95)) {
    drawText(page, fontReg, line, M, y, 9);
    y -= 12;
  }

  y -= 24;
  drawText(page, fontReg, "Người mua hàng", M + 40, y, 9);
  drawText(page, fontReg, "Người bán hàng", M + 360, y, 9);
  y -= 12;
  drawText(page, fontReg, "(Ký, ghi rõ họ tên)", M + 30, y, 8, rgb(0.45, 0.45, 0.5));
  drawText(page, fontReg, "(Ký, đóng dấu)", M + 355, y, 8, rgb(0.45, 0.45, 0.5));

  y = M;
  drawText(
    page,
    fontReg,
    "Ghi chú: Hóa đơn điện tử hợp lệ phải phát hành qua cổng TCT. File PDF này là chứng từ nội bộ / đối soát.",
    M,
    y,
    7,
    rgb(0.45, 0.45, 0.5),
  );

  return doc.save();
}
