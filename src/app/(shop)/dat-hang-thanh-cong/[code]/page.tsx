import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ClearCartOnMount } from "@/components/store/clear-cart-on-mount";
import { OrderPaymentBlock } from "@/components/store/order-payment-block";
import { OrderSummaryCard } from "@/components/store/order-summary-card";
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

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <ClearCartOnMount />
      <div className="rounded-[var(--radius)] border border-green-200 bg-green-50 px-6 py-5">
        <h1 className="text-2xl font-bold text-[var(--brand-secondary)]">
          Đặt hàng thành công
        </h1>
        <p className="mt-2 text-sm text-[var(--brand-muted)]">
          Chúng tôi đã nhận đơn hàng của bạn. Vui lòng kiểm tra thông tin bên dưới.
        </p>
      </div>

      <div className="mt-8">
        <OrderSummaryCard order={order} shopName={settings.shop_name} />
        <OrderPaymentBlock order={order} settings={settings} />
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
