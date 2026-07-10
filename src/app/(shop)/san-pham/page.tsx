import type { Metadata } from "next";
import Link from "next/link";
import { ProductCard } from "@/components/store/product-card";
import { EmptyState } from "@/components/ui/empty";
import { repo } from "@/lib/data/repository";
import { pageMetadata } from "@/lib/seo/metadata";

export const revalidate = 60;

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ sort?: string; q?: string }>;
}): Promise<Metadata> {
  const { sort, q } = await searchParams;
  const hasFilters = Boolean(q?.trim() || sort);
  const base = pageMetadata({
    title: "Sản phẩm",
    description: "Danh mục thiết bị y tế đầy đủ — máy đo huyết áp, máy xông khí dung, nhiệt kế và vật tư y tế.",
    path: "/san-pham",
  });
  if (hasFilters) {
    return { ...base, robots: { index: false, follow: true } };
  }
  return base;
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ sort?: string; q?: string }>;
}) {
  const { sort, q } = await searchParams;
  const [categories, products] = await Promise.all([
    repo.listCategories(),
    repo.listProducts({ publishedOnly: true }),
  ]);
  let list = [...products];
  if (q?.trim()) {
    const needle = q.trim().toLowerCase();
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(needle) ||
        p.sku.toLowerCase().includes(needle) ||
        p.description.toLowerCase().includes(needle),
    );
  }
  if (sort === "price-asc") list.sort((a, b) => a.price - b.price);
  if (sort === "price-desc") list.sort((a, b) => b.price - a.price);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-bold">Sản phẩm</h1>
      <p className="mt-2 text-[var(--brand-muted)]">
        {q?.trim()
          ? `Kết quả cho “${q.trim()}”: ${list.length} sản phẩm`
          : `${list.length} thiết bị y tế đang kinh doanh`}
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        <Link
          href="/san-pham"
          className="rounded-full bg-[var(--brand-primary)] px-3 py-1.5 text-sm text-white"
        >
          Tất cả
        </Link>
        {categories.map((c) => (
          <Link
            key={c.id}
            href={`/danh-muc/${c.slug}`}
            className="rounded-full bg-white px-3 py-1.5 text-sm text-[var(--brand-text)] ring-1 ring-slate-200 hover:ring-[var(--brand-primary)]"
          >
            {c.name}
          </Link>
        ))}
      </div>

      <div className="mt-4 flex gap-3 text-sm">
        <Link href="/san-pham?sort=price-asc" className="text-[var(--brand-primary)]">
          Giá tăng
        </Link>
        <Link href="/san-pham?sort=price-desc" className="text-[var(--brand-primary)]">
          Giá giảm
        </Link>
      </div>

      {list.length === 0 ? (
        <div className="mt-10">
          <EmptyState title="Chưa có sản phẩm" description="Admin hãy thêm sản phẩm mới." />
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
          {list.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}