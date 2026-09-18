import Image from "next/image";
import { CopyButton } from "@/components/store/copy-button";
import { formatVnd } from "@/lib/format";
import type { Order, SiteSettings } from "@/lib/types";
import { buildVietQrImageUrl, guessBankBin } from "@/lib/vietqr";

export function OrderPaymentBlock({
  order,
  settings,
}: {
  order: Order;
  settings: SiteSettings;
}) {
  const content = (settings.transfer_content_template || "DH {code}").replace(
    "{code}",
    order.code,
  );
  const bin = settings.bank_bin || guessBankBin(settings.bank_name);
  const qrUrl =
    bin && settings.bank_account
      ? buildVietQrImageUrl({
          bankBin: bin,
          accountNumber: settings.bank_account.replace(/\s/g, ""),
          amount: order.total,
          description: content,
          accountName: settings.bank_holder,
        })
      : settings.qr_image_url || null;

  return (
    <div className="mt-8 rounded-xl border border-slate-200 bg-white p-6">
      <h3 className="text-lg font-bold">Thanh toán chuyển khoản</h3>
      <p className="mt-2 text-sm text-[var(--brand-muted)]">
        Số tiền: <strong className="text-[var(--brand-sale)]">{formatVnd(order.total)}</strong>
      </p>
      <dl className="mt-4 space-y-2 text-sm">
        <div className="flex justify-between gap-4">
          <dt className="text-[var(--brand-muted)]">Ngân hàng</dt>
          <dd className="font-medium">{settings.bank_name || "—"}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-[var(--brand-muted)]">Số TK</dt>
          <dd className="font-medium">{settings.bank_account}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-[var(--brand-muted)]">Chủ TK</dt>
          <dd className="text-right font-medium">{settings.bank_holder}</dd>
        </div>
        <div className="flex items-center justify-between gap-4">
          <dt className="text-[var(--brand-muted)]">Nội dung CK</dt>
          <dd className="flex items-center gap-2 font-mono font-semibold">
            {content}
            <CopyButton value={content} />
          </dd>
        </div>
      </dl>
      {qrUrl ? (
        <div className="mt-6 flex flex-col items-center">
          <div className="relative h-56 w-56 overflow-hidden rounded-lg border bg-white p-2">
            <Image src={qrUrl} alt="VietQR" fill className="object-contain" unoptimized />
          </div>
          <p className="mt-2 text-xs text-[var(--brand-muted)]">Quét mã VietQR để chuyển khoản</p>
        </div>
      ) : null}
      {order.need_vat_invoice ? (
        <div className="mt-6 rounded-lg bg-amber-50 p-4 text-sm">
          <p className="font-semibold">Thông tin VAT</p>
          <p>{order.vat_company_name}</p>
          <p>MST: {order.vat_tax_code}</p>
          <p>{order.vat_address}</p>
          <p>{order.vat_email}</p>
        </div>
      ) : null}
    </div>
  );
}
