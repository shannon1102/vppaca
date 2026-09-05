import Image from "next/image";
import Link from "next/link";
import { ArticleCard } from "@/components/store/article-card";
import { ProductCard } from "@/components/store/product-card";
import { TAM_DUC_BRAND } from "@/lib/brand-content";
import { repo } from "@/lib/data/repository";
import { pageMetadata, SEO_KEYWORDS } from "@/lib/seo/metadata";

export const revalidate = 60;

export async function generateMetadata() {
  const settings = await repo.getSettings();
  return pageMetadata({
    title: `${settings.shop_name} — Thiết bị Y tế Hà Nội chính hãng`,
    description:
      `${settings.tagline} Mua thiết bị y tế tại Hà Nội, Hà Đông — máy đo huyết áp, nhiệt kế, máy xông, vật tư y tế chính hãng tại Thiết bị Y tế Tâm Đức.`,
    path: "/",
    image: settings.logo_url || "/brand/tam-duc-logo.png",
    keywords: [...SEO_KEYWORDS],
  });
}

export default async function HomePage() {
  const [settings, categories, products, articles] = await Promise.all([
    repo.getSettings(),
    repo.listCategories(),
    repo.listProducts({ publishedOnly: true }),
    repo.listArticles({ publishedOnly: true }),
  ]);
  const featured = products.filter((p) => p.is_featured).slice(0, 8);

  return (
    <div>
      <section className="relative overflow-hidden border-b border-slate-200 bg-[var(--brand-secondary)] text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(46,125,50,0.4),transparent_55%)]" />
        <div className="relative mx-auto grid max-w-6xl gap-10 px-4 py-16 md:grid-cols-2 md:items-center md:py-24">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-[var(--brand-accent)]">
              {settings.shop_name}
            </p>
            <h1 className="mt-3 text-4xl font-bold leading-tight md:text-5xl">
              Thiết bị Y tế chính hãng tại Hà Nội
            </h1>
            <p className="mt-3 text-lg text-white/90">{settings.tagline}</p>
            <p className="mt-4 max-w-lg text-white/80">{TAM_DUC_BRAND.heroDescription}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/san-pham"
                className="inline-flex min-h-11 items-center justify-center rounded-[var(--radius)] bg-white px-5 text-sm font-bold text-[var(--brand-secondary)] shadow-sm transition hover:bg-green-50"
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
          <div className="relative mx-auto aspect-[4/3] w-full max-w-lg overflow-hidden rounded-2xl border border-white/25 bg-white shadow-2xl">
            <Image
              src={TAM_DUC_BRAND.heroImage}
              alt={TAM_DUC_BRAND.heroImageAlt}
              fill
              className="object-cover object-center"
              sizes="(max-width:768px) 100vw, 520px"
              quality={90}
              priority
            />
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
          {featured.length > 0 ? (
            <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
              {featured.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <p className="mt-8 rounded-[var(--radius)] border border-dashed border-slate-200 bg-slate-50 px-4 py-10 text-center text-sm text-[var(--brand-muted)]">
              Đang cập nhật danh mục thiết bị y tế. Vui lòng liên hệ hotline để được tư vấn,
              hoặc quay lại sau khi shop đăng sản phẩm mới.
            </p>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold">Kiến thức sức khỏe</h2>
            <p className="mt-1 text-sm text-[var(--brand-muted)]">
              Kiến thức y tế, mẹo chăm sóc sức khỏe và hướng dẫn sử dụng thiết bị y tế tại nhà.
            </p>
          </div>
          <Link
            href="/bai-viet-suc-khoe"
            className="text-sm font-semibold text-[var(--brand-primary)] hover:underline"
          >
            Xem tất cả
          </Link>
        </div>
        {articles.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((a) => (
              <ArticleCard key={a.id} article={a} />
            ))}
          </div>
        ) : (
          <p className="rounded-[var(--radius)] border border-dashed border-slate-200 bg-slate-50 px-4 py-10 text-center text-sm text-[var(--brand-muted)]">
            Chưa có bài viết nào.
          </p>
        )}
      </section>
    </div>
  );
}
