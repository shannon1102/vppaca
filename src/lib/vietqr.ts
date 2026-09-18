/** VietQR image URL (img.vietqr.io) — chỉ dùng khi đã cấu hình BIN ngân hàng */
export function buildVietQrImageUrl(opts: {
  bankBin: string;
  accountNumber: string;
  amount: number;
  description: string;
  accountName?: string;
}): string {
  const amount = Math.round(opts.amount);
  const desc = encodeURIComponent(opts.description.slice(0, 50));
  const name = opts.accountName ? `&accountName=${encodeURIComponent(opts.accountName)}` : "";
  return `https://img.vietqr.io/image/${opts.bankBin}-${opts.accountNumber}-compact2.png?amount=${amount}&addInfo=${desc}${name}`;
}

/** Map tên ngân hàng phổ biến → BIN (có thể mở rộng trong admin sau) */
export function guessBankBin(bankName: string): string | null {
  const n = bankName.toLowerCase();
  if (n.includes("vietcombank") || n.includes("vcb")) return "970436";
  if (n.includes("techcombank") || n.includes("tcb")) return "970407";
  if (n.includes("mb") || n.includes("mbbank")) return "970422";
  if (n.includes("bidv")) return "970418";
  if (n.includes("vietin")) return "970415";
  return null;
}
