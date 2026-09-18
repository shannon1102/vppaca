import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { CatalogSidebar } from "@/components/store/catalog-sidebar";
import { ProductCard } from "@/components/store/product-card";
import { ProductPriceFilter } from "@/components/store/product-price-filter";
import { EmptyState } from "@/components/ui/empty";
import { CatalogPagination } from "@/components/store/catalog-pagination";
import { parseCatalogPage } from "@/lib/catalog/list-products-page";
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
  const page = parseCatalogPage(sp.page);
  const { items: list, total, totalPages } = await repo.listProductsPage({
    publishedOnly: true,
    filters: sp,
    promoProducts: flash.products,
    page,
  });

  return (
    <div className="shop-container py-10">
      <div className="grid gap-8 md:grid-cols-[220px_1fr]">
        <CatalogSidebar basePath="/san-pham" categories={categories} products={products} />
        <div className="catalog-main-panel min-w-0">
          <div className="catalog-main-panel__head">
            <h1 className="text-2xl font-bold md:text-3xl">Sản phẩm</h1>
            <p className="mt-2 text-sm text-[var(--brand-muted)] md:text-base">
              {sp.q?.trim()
                ? `Kết quả “${sp.q.trim()}”: ${total} sản phẩm`
                : `${total} mặt hàng văn phòng phẩm`}
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
                className="rounded-full bg-[var(--brand-sale)] px-3 py-1.5 text-sm font-medium text-white shadow-sm"
              >
                Tất cả
              </Link>
              {categories
                .filter((c) => !c.parent_id)
                .map((c) => (
                  <Link
                    key={c.id}
                    href={`/danh-muc/${c.slug}`}
                    className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium shadow-sm hover:border-[var(--brand-primary)]"
                  >
                    {c.name}
                  </Link>
                ))}
            </div>

            <div className="catalog-main-panel__toolbar text-sm">
              <span className="font-semibold text-[var(--brand-muted)]">Sắp xếp:</span>
              <Link href="/san-pham?sort=sold" className="font-medium text-[var(--brand-primary)]">
                Bán chạy
              </Link>
              <Link href="/san-pham?sort=price-asc" className="font-medium text-[var(--brand-primary)]">
                Giá tăng
              </Link>
              <Link href="/san-pham?sort=price-desc" className="font-medium text-[var(--brand-primary)]">
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
          </div>

          <div className="catalog-main-panel__body">
            {list.length === 0 ? (
              <EmptyState title="Không tìm thấy sản phẩm" />
            ) : (
              <>
                <div className="catalog-grid-frame">
                  <div className="product-grid-shopee">
                    {list.map((p) => (
                      <ProductCard
                        key={p.id}
                        product={p}
                        overrideSalePrice={promoMap.get(p.id) ?? undefined}
                      />
                    ))}
                  </div>
                </div>
                <CatalogPagination
                  basePath="/san-pham"
                  searchParams={sp}
                  page={page}
                  totalPages={totalPages}
                  total={total}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
