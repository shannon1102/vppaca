import Image from "next/image";
import Link from "next/link";
import { ProductCard } from "@/components/store/product-card";
import { repo } from "@/lib/data/repository";
import { pageMetadata } from "@/lib/seo/metadata";

export const revalidate = 60;

export async function generateMetadata() {
  const settings = await repo.getSettings();
  return pageMetadata({
    title: `${settings.shop_name} — Thiết bị y tế chính hãng`,
    description: settings.tagline,
    path: "/",
    image: "/products/p-01.jpg",
  });
}

export default async function HomePage() {
  const [settings, categories, products] = await Promise.all([
    repo.getSettings(),
    repo.listCategories(),
    repo.listProducts({ publishedOnly: true }),
  ]);
  const featured = products.filter((p) => p.is_featured).slice(0, 8);
  const latest = products.slice(0, 8);

  return (
    <div>
      <section className="relative overflow-hidden border-b border-slate-200 bg-[var(--brand-secondary)] text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(15,118,110,0.45),transparent_55%)]" />
        <div className="relative mx-auto grid max-w-6xl gap-10 px-4 py-16 md:grid-cols-2 md:items-center md:py-24">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-teal-200">
              {settings.shop_name}
            </p>
            <h1 className="mt-3 text-4xl font-bold leading-tight md:text-5xl">
              {settings.tagline}
            </h1>
            <p className="mt-4 max-w-lg text-white/80">
              Catalog thiết bị y tế rõ ràng, đặt hàng nhanh, thanh toán chuyển khoản
              kèm QR — vận hành gọn cho 1 admin.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/san-pham"
                className="inline-flex min-h-11 items-center justify-center rounded-[var(--radius)] bg-white px-5 text-sm font-bold text-[#134E4A] shadow-sm transition hover:bg-teal-50"
              >
                Xem sản phẩm
              </Link>
              <Link
                href="/lien-he"
                className="inline-flex min-h-11 items-center justify-center rounded-[var(--radius)] border border-white/40 px-5 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Liên hệ tư vấn
              </Link>
            </div>
          </div>
          <div className="relative mx-auto aspect-[4/3] w-full max-w-lg overflow-hidden rounded-2xl border border-white/20 bg-white/10 shadow-xl">
            <Image
              src="/products/p-01.jpg"
              alt={`Thiết bị y tế chính hãng — ${settings.shop_name}`}
              fill
              className="object-cover"
              sizes="(max-width:768px) 100vw, 520px"
              priority
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[var(--brand-secondary)]/40 to-transparent" />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold">Danh mục nổi bật</h2>
            <p className="mt-1 text-sm text-[var(--brand-muted)]">
              Chọn nhóm thiết bị phù hợp nhu cầu
            </p>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/danh-muc/${c.slug}`}
              className="rounded-[var(--radius)] border border-slate-200 bg-white p-4 shadow-sm transition hover:border-[var(--brand-primary)]"
            >
              <div className="relative mb-3 aspect-video overflow-hidden rounded-lg bg-slate-100">
                {c.image_url ? (
                  <Image src={c.image_url} alt={c.name} fill className="object-cover" sizes="(max-width:640px) 50vw, 20vw" />
                ) : null}
              </div>
              <h3 className="font-semibold">{c.name}</h3>
              <p className="mt-1 line-clamp-2 text-xs text-[var(--brand-muted)]">
                {c.description}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-white py-14">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-2xl font-bold">Sản phẩm nổi bật</h2>
          <p className="mt-1 text-sm text-[var(--brand-muted)]">
            Lựa chọn bán chạy / khuyến nghị
          </p>
          <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold">Mới cập nhật</h2>
            <p className="mt-1 text-sm text-[var(--brand-muted)]">
              {products.length} sản phẩm đang bán
            </p>
          </div>
          <Link
            href="/san-pham"
            className="text-sm font-semibold text-[var(--brand-primary)] hover:underline"
          >
            Xem tất cả
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {latest.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
}
