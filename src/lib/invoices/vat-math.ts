import type { OrderItem, VatInvoiceLine } from "@/lib/types";

export function normalizePhone(phone: string): string {
  return phone.replace(/\D/g, "");
}

export function splitLineAmounts(
  unitPrice: number,
  qty: number,
  vatRate: number,
  pricesIncludeTax: boolean,
): Pick<VatInvoiceLine, "unit_price_ex_vat" | "line_ex_vat" | "vat_amount" | "line_inc_vat"> {
  const rate = vatRate / 100;
  if (pricesIncludeTax) {
    const lineInc = unitPrice * qty;
    const lineEx = lineInc / (1 + rate);
    const vat = lineInc - lineEx;
    return {
      unit_price_ex_vat: lineEx / qty,
      line_ex_vat: lineEx,
      vat_amount: vat,
      line_inc_vat: lineInc,
    };
  }
  const lineEx = unitPrice * qty;
  const vat = lineEx * rate;
  return {
    unit_price_ex_vat: unitPrice,
    line_ex_vat: lineEx,
    vat_amount: vat,
    line_inc_vat: lineEx + vat,
  };
}

export function buildVatLinesFromOrderItems(
  items: OrderItem[],
  vatRate: number,
  pricesIncludeTax: boolean,
): VatInvoiceLine[] {
  return items.map((item) => {
    const split = splitLineAmounts(item.unit_price, item.qty, vatRate, pricesIncludeTax);
    return {
      name: item.name,
      unit: item.uom_code || "cái",
      qty: item.qty,
      vat_rate: vatRate,
      ...split,
    };
  });
}

export function sumVatLines(lines: VatInvoiceLine[]): {
  subtotal_ex_vat: number;
  vat_amount: number;
  total_inc_vat: number;
} {
  let subtotal_ex_vat = 0;
  let vat_amount = 0;
  let total_inc_vat = 0;
  for (const line of lines) {
    subtotal_ex_vat += line.line_ex_vat;
    vat_amount += line.vat_amount;
    total_inc_vat += line.line_inc_vat;
  }
  return { subtotal_ex_vat, vat_amount, total_inc_vat };
}

export function formatVndInvoice(n: number): string {
  return new Intl.NumberFormat("vi-VN").format(Math.round(n));
}

export function amountInWordsVnd(total: number): string {
  const n = Math.round(total);
  if (n === 0) return "Không đồng";
  const units = ["", " nghìn", " triệu", " tỷ"];
  const digits = ["không", "một", "hai", "ba", "bốn", "năm", "sáu", "bảy", "tám", "chín"];

  function readTriple(num: number, full: boolean): string {
    const tr = Math.floor(num / 100);
    const ch = Math.floor((num % 100) / 10);
    const dv = num % 10;
    const parts: string[] = [];
    if (tr > 0 || full) {
      parts.push(`${digits[tr]} trăm`);
    }
    if (ch > 1) {
      parts.push(`${digits[ch]} mươi${dv === 1 ? " mốt" : dv === 5 ? " lăm" : dv > 0 ? ` ${digits[dv]}` : ""}`);
    } else if (ch === 1) {
      parts.push(`mười${dv === 5 ? " lăm" : dv > 0 ? ` ${digits[dv]}` : ""}`);
    } else if (dv > 0) {
      if (tr > 0 || full) parts.push("lẻ");
      parts.push(digits[dv]);
    }
    return parts.join(" ").trim();
  }

  let remaining = n;
  const chunks: string[] = [];
  let u = 0;
  while (remaining > 0) {
    const chunk = remaining % 1000;
    if (chunk > 0) {
      const text = readTriple(chunk, remaining >= 1000);
      chunks.unshift(`${text}${units[u]}`);
    }
    remaining = Math.floor(remaining / 1000);
    u += 1;
  }
  const raw = chunks.join(" ").replace(/\s+/g, " ").trim();
  return `${raw.charAt(0).toUpperCase()}${raw.slice(1)} đồng`;
}
