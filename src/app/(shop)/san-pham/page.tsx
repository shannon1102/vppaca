import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { CatalogSidebar } from "@/components/store/catalog-sidebar";
import { ProductCard } from "@/components/store/product-card";
import { ProductPriceFilter } from "@/components/store/product-price-filter";
import { EmptyState } from "@/components/ui/empty";
import { filterAndSortProducts } from "@/lib/catalog-filters";
import { repo, vppGetActiveFlashSale } from "@/lib/data/repository";
import { pageMetadata, SEO_KEYWORDS } from "@/lib/seo/metadata";

export const revalidate = 60;

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}): Promise<Metadata> {
  const sp = await searchParams;
  const hasFilters = Boolean(sp.q?.trim() || sp.sort || sp.minPrice || sp.maxPrice);
  const base = pageMetadata({
    title: "Văn phòng phẩm | VPPACA",
    description: "Danh mục văn phòng phẩm — giấy A4, bút viết, mực in, bìa hồ sơ.",
    path: "/san-pham",
    keywords: [...SEO_KEYWORDS],
  });
  if (hasFilters) {
    return { ...base, robots: { index: false, follow: true } };
  }
  return base;
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const sp = await searchParams;
  const [categories, products, flash] = await Promise.all([
    repo.listCategories(),
    repo.listProducts({ publishedOnly: true }),
    vppGetActiveFlashSale(),
  ]);
  const promoMap = new Map(flash.products.map((p) => [p.product_id, p.sale_price]));
  const list = filterAndSortProducts(products, sp, flash.products);

  return (
    <div className="shop-container py-10">
      <div className="grid gap-8 md:grid-cols-[220px_1fr]">
        <CatalogSidebar basePath="/san-pham" categories={categories} products={products} />
        <div>
          <h1 className="text-3xl font-bold">Sản phẩm</h1>
          <p className="mt-2 text-[var(--brand-muted)]">
            {sp.q?.trim()
              ? `Kết quả “${sp.q.trim()}”: ${list.length} sản phẩm`
              : `${list.length} mặt hàng văn phòng phẩm`}
            {(sp.minPrice || sp.maxPrice) && (
              <span>
                {" "}
                · Giá{" "}
                {sp.minPrice ? `từ ${Number(sp.minPrice).toLocaleString("vi-VN")}đ` : ""}
                {sp.maxPrice ? ` đến ${Number(sp.maxPrice).toLocaleString("vi-VN")}đ` : ""}
              </span>
            )}
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            <Link
              href="/san-pham"
              className="rounded-full bg-[var(--brand-sale)] px-3 py-1.5 text-sm text-white"
            >
              Tất cả
            </Link>
            {categories.map((c) => (
              <Link
                key={c.id}
                href={`/danh-muc/${c.slug}`}
                className="rounded-full bg-white px-3 py-1.5 text-sm ring-1 ring-slate-200 hover:ring-[var(--brand-primary)]"
              >
                {c.name}
              </Link>
            ))}
          </div>

          <div className="mt-4 flex flex-wrap gap-3 text-sm">
            <Link href="/san-pham?sort=sold" className="text-[var(--brand-primary)]">
              Bán chạy
            </Link>
            <Link href="/san-pham?sort=price-asc" className="text-[var(--brand-primary)]">
              Giá tăng
            </Link>
            <Link href="/san-pham?sort=price-desc" className="text-[var(--brand-primary)]">
              Giá giảm
            </Link>
            <Link href="/san-pham?sale=1" className="font-semibold text-[var(--brand-sale)]">
              Đang giảm giá
            </Link>
          </div>

          <div className="mt-4 md:hidden">
            <Suspense fallback={null}>
              <ProductPriceFilter basePath="/san-pham" />
            </Suspense>
          </div>

          {list.length === 0 ? (
            <div className="mt-10">
              <EmptyState title="Không tìm thấy sản phẩm" />
            </div>
          ) : (
            <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {list.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  overrideSalePrice={promoMap.get(p.id) ?? undefined}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
