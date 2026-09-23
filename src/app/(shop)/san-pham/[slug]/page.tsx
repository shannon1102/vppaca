import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductBuyPanel } from "@/components/store/product-buy-panel";
import { ProductImageGallery } from "@/components/store/product-image-gallery";
import { CatalogBreadcrumb } from "@/components/store/catalog-breadcrumb";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-jsonld";
import { RichContent } from "@/components/ui/rich-content";
import { ProductCard } from "@/components/store/product-card";
import { effectivePrice, formatVnd, stripHtml } from "@/lib/format";
import {
  repo,
  vppGetActiveFlashSale,
  vppGetProductCatalog,
} from "@/lib/data/repository";
import { absoluteImageUrls, absoluteUrl } from "@/lib/seo/jsonld";
import { noindexMetadata, pageMetadata } from "@/lib/seo/metadata";

export const revalidate = 60;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await repo.getProductBySlug(slug);
  if (!product) return noindexMetadata("Sản phẩm", "Sản phẩm không tồn tại.");
  const desc = product.seo_description || stripHtml(product.description);
  return {
    ...pageMetadata({
      title: product.seo_title || product.name,
      description: desc,
      path: `/san-pham/${slug}`,
      image: product.images[0],
    }),
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const product = await repo.getProductBySlug(slug);
  if (!product) notFound();

  const [catalog, related, settings, flash] = await Promise.all([
    vppGetProductCatalog(product),
    repo.listRelatedProducts(product.category_id, product.id, 4),
    repo.getSettings(),
    vppGetActiveFlashSale(),
  ]);

  const price = effectivePrice(product.price, product.sale_price);
  const productUrl = absoluteUrl(`/san-pham/${product.slug}`);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    sku: product.sku,
    description: stripHtml(product.description),
    image: absoluteImageUrls(product.images),
    url: productUrl,
    brand: { "@type": "Brand", name: product.brand || settings.shop_name },
    offers: {
      "@type": "Offer",
      priceCurrency: "VND",
      price,
      availability:
        product.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      url: productUrl,
    },
  };

  return (
    <div className="shop-container py-6 md:py-8">
      <CatalogBreadcrumb
        items={[
          { name: "Trang chủ", href: "/" },
          { name: "Sản phẩm", href: "/san-pham" },
          { name: product.name },
        ]}
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Trang chủ", path: "/" },
          { name: "Sản phẩm", path: "/san-pham" },
          { name: product.name, path: `/san-pham/${product.slug}` },
        ]}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="pdp-layout">
        <ProductImageGallery images={product.images} name={product.name} />

        <div className="min-w-0">
          <h1 className="text-2xl font-bold leading-snug md:text-[1.75rem]">{product.name}</h1>
          <p className="mt-2 text-sm text-[var(--brand-muted)]">
            Mã: {product.sku} ·{" "}
            <span className={product.stock > 0 ? "font-semibold text-emerald-600" : "text-[var(--brand-sale)]"}>
              {product.stock > 0 ? "Còn hàng" : "Hết hàng"}
            </span>
          </p>
          <p className="mt-1 text-sm text-[var(--brand-muted)]">
            Đã bán {product.sold_count.toLocaleString("vi-VN")} · Tồn: {product.stock}{" "}
            {product.base_uom_code}
          </p>

          <div className="pdp-price-block">
            <p className="text-sm font-semibold text-[var(--brand-muted)]">Giá bán</p>
            <p className="mt-1 flex flex-wrap items-baseline gap-2">
              <span className="text-3xl font-extrabold text-[var(--brand-sale)]">
                {formatVnd(price)}
              </span>
              {product.sale_price != null && product.sale_price < product.price ? (
                <>
                  <span className="text-base text-[var(--brand-muted)] line-through">
                    {formatVnd(product.price)}
                  </span>
                  <span className="rounded bg-[var(--brand-sale)] px-2 py-0.5 text-xs font-bold text-white">
                    -
                    {Math.round(((product.price - price) / product.price) * 100)}%
                  </span>
                </>
              ) : null}
            </p>
          </div>

          {product.description.trim() ? (
            <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed">{stripHtml(product.description)}</p>
          ) : null}
          <div className="mt-6">
            <ProductBuyPanel catalog={catalog} promoProducts={flash.products} />
          </div>
          <dl className="mt-6 divide-y divide-slate-100 rounded-[var(--radius)] border border-slate-200 bg-white">
            {Object.entries(product.specs).map(([k, v]) => (
              <div key={k} className="grid grid-cols-2 gap-2 px-4 py-3 text-sm">
                <dt className="text-[var(--brand-muted)]">{k}</dt>
                <dd className="font-medium">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {product.detail_description.trim() ? (
        <section className="mt-12 rounded-[var(--radius)] border border-slate-200 bg-white p-6 md:p-8">
          <h2 className="text-2xl font-bold">Mô tả chi tiết</h2>
          <div className="mt-6 min-w-0">
            <RichContent content={product.detail_description} className="max-w-none" />
          </div>
        </section>
      ) : null}

      {related.length > 0 ? (
        <section className="mt-16">
          <h2 className="text-2xl font-bold">Sản phẩm liên quan</h2>
          <div className="product-grid-tl mt-6">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
