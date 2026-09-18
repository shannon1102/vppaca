import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-jsonld";
import { CatalogSidebar } from "@/components/store/catalog-sidebar";
import { ProductCard } from "@/components/store/product-card";
import { ProductPriceFilter } from "@/components/store/product-price-filter";
import { EmptyState } from "@/components/ui/empty";
import { filterAndSortProducts } from "@/lib/catalog-filters";
import { repo, vppGetActiveFlashSale } from "@/lib/data/repository";
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
  const products = filterAndSortProducts(allProducts, sp, flash.products);
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
    <div className="shop-container py-10">
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
      <div className="grid gap-8 md:grid-cols-[220px_1fr]">
        <CatalogSidebar
          basePath={basePath}
          categories={cats}
          products={allProducts}
          activeCategorySlug={slug}
        />
        <div>
          <h1 className="text-3xl font-bold">{cat.name}</h1>
          <p className="mt-2 text-[var(--brand-muted)]">{cat.description}</p>
          <div className="mt-4 md:hidden">
            <Suspense fallback={null}>
              <ProductPriceFilter basePath={basePath} />
            </Suspense>
          </div>
          {products.length === 0 ? (
            <div className="mt-10">
              <EmptyState title="Không có sản phẩm phù hợp bộ lọc" />
            </div>
          ) : (
            <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {products.map((p) => (
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
