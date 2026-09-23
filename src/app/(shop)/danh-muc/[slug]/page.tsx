import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import Image from "next/image";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-jsonld";
import { CatalogBreadcrumb } from "@/components/store/catalog-breadcrumb";
import { CatalogSidebar } from "@/components/store/catalog-sidebar";
import { ProductCard } from "@/components/store/product-card";
import { ProductPriceFilter } from "@/components/store/product-price-filter";
import { EmptyState } from "@/components/ui/empty";
import { CatalogPagination } from "@/components/store/catalog-pagination";
import { parseCatalogPage } from "@/lib/catalog/list-products-page";
import { repo, vppGetActiveFlashSale } from "@/lib/data/repository";
import { catalogImageSrc } from "@/lib/media/safe-image-src";
import { absoluteUrl } from "@/lib/seo/jsonld";
import { noindexMetadata, pageMetadata, SEO_KEYWORDS } from "@/lib/seo/metadata";

export const revalidate = 60;

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | undefined>>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const cats = await repo.listCategories();
  const cat = cats.find((c) => c.slug === slug);
  if (!cat) return noindexMetadata("Danh mục", "Danh mục không tồn tại.");
  return pageMetadata({
    title: `${cat.name} — VPPACA`,
    description: cat.description || `Mua ${cat.name} — giá sỉ & lẻ, giao nhanh.`,
    path: `/danh-muc/${slug}`,
    image: cat.image_url ?? undefined,
    keywords: [...SEO_KEYWORDS, cat.name],
  });
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const sp = await searchParams;
  const cats = await repo.listCategories();
  const cat = cats.find((c) => c.slug === slug);
  if (!cat) notFound();

  const [allProducts, flash] = await Promise.all([
    repo.listProducts({ publishedOnly: true, categorySlug: slug }),
    vppGetActiveFlashSale(),
  ]);
  const promoMap = new Map(flash.products.map((p) => [p.product_id, p.sale_price]));
  const page = parseCatalogPage(sp.page);
  const {
    items: products,
    total,
    totalPages,
  } = await repo.listProductsPage({
    publishedOnly: true,
    categorySlug: slug,
    filters: sp,
    promoProducts: flash.products,
    page,
  });
  const basePath = `/danh-muc/${slug}`;

  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: cat.name,
    description: cat.description,
    url: absoluteUrl(basePath),
    mainEntity: {
      "@type": "ItemList",
      itemListElement: products.map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: absoluteUrl(`/san-pham/${p.slug}`),
        name: p.name,
      })),
    },
  };

  return (
    <div className="shop-container py-6 md:py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Trang chủ", path: "/" },
          { name: "Sản phẩm", path: "/san-pham" },
          { name: cat.name, path: basePath },
        ]}
      />
      <CatalogBreadcrumb
        items={[
          { name: "Trang chủ", href: "/" },
          { name: "Danh mục", href: "/san-pham" },
          { name: cat.name },
        ]}
      />

      <div className="catalog-layout">
        <CatalogSidebar
          basePath={basePath}
          categories={cats}
          products={allProducts}
          activeCategorySlug={slug}
          searchParams={sp}
        />
        <div className="catalog-main-panel min-w-0">
          <div className="catalog-main-panel__head">
            <h1 className="text-center text-2xl font-bold md:text-3xl">{cat.name}</h1>
            {cat.image_url ? (
              <div className="relative mx-auto mt-4 aspect-[21/6] max-h-52 w-full overflow-hidden rounded-[var(--radius)] border border-slate-200 bg-white">
                <Image
                  src={catalogImageSrc(cat.image_url)}
                  alt={cat.name}
                  fill
                  className="object-cover"
                  sizes="(max-width:1580px) 100vw, 1580px"
                  priority
                />
              </div>
            ) : null}
            {cat.description ? (
              <p className="mt-2 text-sm text-[var(--brand-muted)] md:text-base">{cat.description}</p>
            ) : null}
            <p className="mt-3 text-sm font-medium text-[var(--brand-text)]">
              {total.toLocaleString("vi-VN")} sản phẩm
            </p>
            <div className="mt-4 md:hidden">
              <Suspense fallback={null}>
                <ProductPriceFilter basePath={basePath} />
              </Suspense>
            </div>
          </div>
          <div className="catalog-main-panel__body">
            {products.length === 0 ? (
              <EmptyState title="Không có sản phẩm phù hợp bộ lọc" />
            ) : (
              <>
                <div className="catalog-grid-frame">
                  <div className="product-grid-tl">
                    {products.map((p) => (
                      <ProductCard
                        key={p.id}
                        product={p}
                        overrideSalePrice={promoMap.get(p.id) ?? undefined}
                      />
                    ))}
                  </div>
                </div>
                <CatalogPagination
                  basePath={basePath}
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
