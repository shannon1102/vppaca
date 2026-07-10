import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-jsonld";
import { ProductCard } from "@/components/store/product-card";
import { EmptyState } from "@/components/ui/empty";
import { repo } from "@/lib/data/repository";
import { pageMetadata } from "@/lib/seo/metadata";

export const revalidate = 60;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const cats = await repo.listCategories();
  const cat = cats.find((c) => c.slug === slug);
  if (!cat) return { title: "Danh mục" };
  return pageMetadata({
    title: cat.name,
    description: cat.description,
    path: `/danh-muc/${slug}`,
    image: cat.image_url ?? undefined,
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

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
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
