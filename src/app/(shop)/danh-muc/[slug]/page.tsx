import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-jsonld";
import { ProductCard } from "@/components/store/product-card";
import { EmptyState } from "@/components/ui/empty";
import { repo } from "@/lib/data/repository";
import { absoluteUrl } from "@/lib/seo/jsonld";
import { noindexMetadata, pageMetadata, SEO_KEYWORDS } from "@/lib/seo/metadata";

export const revalidate = 60;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const cats = await repo.listCategories();
  const cat = cats.find((c) => c.slug === slug);
  if (!cat) return noindexMetadata("Danh mục", "Danh mục không tồn tại.");
  return pageMetadata({
    title: `${cat.name} — Thiết bị Y tế`,
    description: cat.description || `Mua ${cat.name} chính hãng tại Thiết bị Y tế Tâm Đức, Hà Nội.`,
    path: `/danh-muc/${slug}`,
    image: cat.image_url ?? undefined,
    keywords: [...SEO_KEYWORDS, cat.name],
  });
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const cats = await repo.listCategories();
  const cat = cats.find((c) => c.slug === slug);
  if (!cat) notFound();
  const products = await repo.listProducts({
    publishedOnly: true,
    categorySlug: slug,
  });

  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: cat.name,
    description: cat.description,
    url: absoluteUrl(`/danh-muc/${cat.slug}`),
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
    <div className="mx-auto max-w-6xl px-4 py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Trang chủ", path: "/" },
          { name: "Sản phẩm", path: "/san-pham" },
          { name: cat.name, path: `/danh-muc/${cat.slug}` },
        ]}
      />
      <h1 className="text-3xl font-bold">{cat.name}</h1>
      <p className="mt-2 text-[var(--brand-muted)]">{cat.description}</p>
      {products.length === 0 ? (
        <div className="mt-10">
          <EmptyState title="Danh mục trống" />
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
