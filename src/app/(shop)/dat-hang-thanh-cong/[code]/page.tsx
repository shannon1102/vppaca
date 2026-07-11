import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ClearCartOnMount } from "@/components/store/clear-cart-on-mount";
import { CopyButton } from "@/components/store/copy-button";
import { formatVnd, transferContent } from "@/lib/format";
import { repo } from "@/lib/data/repository";
import { noindexMetadata } from "@/lib/seo/metadata";

type Props = { params: Promise<{ code: string }> };

export async function generateMetadata({ params }: Props) {
  const { code } = await params;
  return noindexMetadata(`Đặt hàng ${code}`, "Xác nhận đơn hàng thành công");
}

export default async function ThankYouPage({ params }: Props) {
  const { code } = await params;
  const [order, settings] = await Promise.all([
    repo.getOrderByCode(code),
    repo.getSettings(),
  ]);
  if (!order) notFound();
  const content = transferContent(settings.transfer_content_template, order.code);

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <ClearCartOnMount />
      <div className="rounded-[var(--radius)] border border-green-200 bg-green-50 px-6 py-5">
        <h1 className="text-2xl font-bold text-[var(--brand-secondary)]">
          Đặt hàng thành công
        </h1>
        <p className="mt-2 text-sm text-[var(--brand-muted)]">
          Mã đơn: <strong className="text-[var(--brand-text)]">{order.code}</strong>
        </p>
        <p className="mt-1 text-sm">
          Tổng thanh toán:{" "}
          <strong className="text-[var(--brand-primary)]">{formatVnd(order.total)}</strong>
        </p>
      </div>

      <div className="mt-8 rounded-[var(--radius)] border border-slate-200 bg-white p-6">
        <h2 className="text-xl font-semibold">Thanh toán chuyển khoản</h2>
        <p className="mt-2 text-sm text-[var(--brand-muted)]">
          Vui lòng chuyển khoản theo thông tin bên dưới. Shop sẽ xác nhận khi nhận được tiền.
        </p>
        <dl className="mt-6 space-y-3 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-[var(--brand-muted)]">Ngân hàng</dt>
            <dd className="font-semibold">{settings.bank_name}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-[var(--brand-muted)]">Số tài khoản</dt>
            <dd className="flex items-center gap-2 font-semibold">
              {settings.bank_account}
              <CopyButton value={settings.bank_account} />
            </dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-[var(--brand-muted)]">Chủ tài khoản</dt>
            <dd className="font-semibold">{settings.bank_holder}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-[var(--brand-muted)]">Nội dung CK</dt>
            <dd className="flex items-center gap-2 font-semibold">
              {content}
              <CopyButton value={content} />
            </dd>
          </div>
        </dl>
        <div className="mt-8 flex flex-col items-center">
          <div className="relative h-56 w-56 overflow-hidden rounded-[var(--radius)] border border-slate-200 bg-white p-2">
            <Image
              src={settings.qr_image_url}
              alt="QR chuyển khoản"
              fill
              className="object-contain"
            />
          </div>
          <p className="mt-3 text-xs text-[var(--brand-muted)]">Quét QR để chuyển khoản</p>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/san-pham">
          <Button variant="secondary">Tiếp tục mua</Button>
        </Link>
        <Link href="/">
          <Button variant="ghost">Về trang chủ</Button>
        </Link>
      </div>
    </div>
  );
}
