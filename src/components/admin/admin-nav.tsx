"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const nav = [
  { href: "/admin", label: "Tổng quan", exact: true },
  { href: "/admin/products", label: "Sản phẩm" },
  { href: "/admin/articles", label: "Bài viết SK" },
  { href: "/admin/categories", label: "Danh mục" },
  { href: "/admin/orders", label: "Đơn hàng" },
  { href: "/admin/branding", label: "Branding + CK/QR" },
  { href: "/admin/email-preview", label: "Email preview" },
];

function isActive(pathname: string, href: string, exact?: boolean): boolean {
  if (exact) return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-1 flex-col gap-0.5 px-3 py-4">
      {nav.map((item) => {
        const active = isActive(pathname, item.href, item.exact);
        return (
          <Link
            key={item.href}
            href={item.href}
            prefetch
            className={`cursor-pointer rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
              active
                ? "bg-white/15 text-white"
                : "text-white/75 hover:bg-white/10 hover:text-white"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
