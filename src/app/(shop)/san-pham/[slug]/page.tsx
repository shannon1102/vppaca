import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AddToCartButton } from "@/components/store/add-to-cart-button";
import { ProductImageGallery } from "@/components/store/product-image-gallery";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-jsonld";
import { RichContent } from "@/components/ui/rich-content";
import { ProductCard } from "@/components/store/product-card";
import { Badge } from "@/components/ui/badge";
import { effectivePrice, formatVnd, stripHtml } from "@/lib/format";
import { repo } from "@/lib/data/repository";
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

  const related = await repo.listRelatedProducts(product.category_id, product.id, 4);
  const settings = await repo.getSettings();

  const price = effectivePrice(product.price, product.sale_price);
  const onSale = product.sale_price != null && product.sale_price < product.price;
  const productUrl = absoluteUrl(`/san-pham/${product.slug}`);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    sku: product.sku,
    description: stripHtml(product.description),
    image: absoluteImageUrls(product.images),
    url: productUrl,
    brand: {
      "@type": "Brand",
      name: settings.shop_name,
    },
    offers: {
      "@type": "Offer",
      priceCurrency: "VND",
      price,
      availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      url: productUrl,
    },
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
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
      <div className="grid gap-10 md:grid-cols-2">
        <ProductImageGallery images={product.images} name={product.name} />

        <div className="min-w-0">
          {onSale ? <Badge>Giảm giá</Badge> : null}
          <h1 className="mt-3 text-3xl font-bold">{product.name}</h1>
          <p className="mt-2 text-sm text-[var(--brand-muted)]">
            SKU: {product.sku}
            <span className="before:mx-2 before:content-['·']">
              Đã bán {product.sold_count}
            </span>
          </p>
          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-3xl font-bold text-[var(--brand-primary)]">
              {formatVnd(price)}
            </span>
            {onSale ? (
              <span className="text-lg text-[var(--brand-muted)] line-through">
                {formatVnd(product.price)}
              </span>
            ) : null}
          </div>
          {product.description.trim() ? (
            <p className="mt-6 whitespace-pre-wrap break-words text-[var(--brand-text)]">
              {stripHtml(product.description)}
            </p>
          ) : null}
          <dl className="mt-6 divide-y divide-slate-100 rounded-[var(--radius)] border border-slate-200 bg-white">
            {Object.entries(product.specs).map(([k, v]) => (
              <div key={k} className="grid grid-cols-2 gap-2 px-4 py-3 text-sm">
                <dt className="text-[var(--brand-muted)]">{k}</dt>
                <dd className="font-medium">{v}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-8">
            <AddToCartButton product={product} />
          </div>
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
          <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
