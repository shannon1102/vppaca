import { noindexMetadata } from "@/lib/seo/metadata";

export const metadata = noindexMetadata(
  "Thanh toán",
  "Thanh toán đơn hàng thiết bị y tế",
);

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
