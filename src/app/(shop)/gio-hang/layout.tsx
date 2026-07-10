import { noindexMetadata } from "@/lib/seo/metadata";

export const metadata = noindexMetadata(
  "Giỏ hàng",
  "Giỏ hàng mua sắm thiết bị y tế",
);

export default function CartLayout({ children }: { children: React.ReactNode }) {
  return children;
}
