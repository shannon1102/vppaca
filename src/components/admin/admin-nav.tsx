"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  IconArticles,
  IconBranding,
  IconCategories,
  IconDashboard,
  IconEmail,
  IconLeads,
  IconOrders,
  IconProducts,
} from "@/components/admin/admin-icons";

const nav = [
  { href: "/admin", label: "Tổng quan", exact: true, Icon: IconDashboard },
  { href: "/admin/products", label: "Sản phẩm", Icon: IconProducts },
  { href: "/admin/articles", label: "Bài viết SK", Icon: IconArticles },
  { href: "/admin/categories", label: "Danh mục", Icon: IconCategories },
  { href: "/admin/orders", label: "Đơn hàng", Icon: IconOrders },
  { href: "/admin/rfq", label: "Báo giá B2B", Icon: IconLeads },
  { href: "/admin/banners", label: "Banner / Sale", Icon: IconBranding },
  { href: "/admin/exports", label: "Xuất CSV", Icon: IconEmail },
  { href: "/admin/leads", label: "Liên hệ", Icon: IconLeads },
  { href: "/admin/branding", label: "Branding + CK/QR", Icon: IconBranding },
  { href: "/admin/email-preview", label: "Email preview", Icon: IconEmail },
] as const;

function isActive(pathname: string, href: string, exact?: boolean): boolean {
  if (exact) return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-1 flex-col gap-0.5 px-3 py-4">
      {nav.map((item) => {
        const active = isActive(pathname, item.href, "exact" in item ? item.exact : undefined);
        const { Icon } = item;
        return (
          <Link
            key={item.href}
            href={item.href}
            prefetch
            className={`flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
              active
                ? "bg-white/15 text-white"
                : "text-white/75 hover:bg-white/10 hover:text-white"
            }`}
          >
            <Icon className={active ? "opacity-100" : "opacity-80"} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
