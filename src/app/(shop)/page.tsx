import Link from "next/link";
import { FlashSaleSection } from "@/components/store/flash-sale-section";
import { HomeCategoryTrends } from "@/components/store/home-category-trends";
import { HomeBannerCarousel } from "@/components/store/home-banner-carousel";
import { ProductCard } from "@/components/store/product-card";
import { VPPACA_BRAND } from "@/lib/brand-content";
import {
  repo,
  vppGetActiveFlashSale,
  vppListBanners,
} from "@/lib/data/repository";
import { pageMetadata, SEO_KEYWORDS } from "@/lib/seo/metadata";

export const revalidate = 60;

export async function generateMetadata() {
  const settings = await repo.getSettings();
  return pageMetadata({
    title: `${settings.shop_name} — Văn phòng phẩm B2B & B2C`,
    description: `${settings.tagline} ${VPPACA_BRAND.heroDescription}`,
    path: "/",
    image: settings.logo_url || "/brand/aca-logo-linear-gradient-red-yellow.png",
    keywords: [...SEO_KEYWORDS],
  });
}

export default async function HomePage() {
  const [settings, categories, products, banners, flash] = await Promise.all([
    repo.getSettings(),
    repo.listCategories(),
    repo.listProducts({ publishedOnly: true }),
    vppListBanners(),
    vppGetActiveFlashSale(),
  ]);

  const flashProductIds = new Set(flash.products.map((p) => p.product_id));
  const flashProducts = products.filter((p) => flashProductIds.has(p.id));
  const featured = products.filter((p) => p.is_featured).slice(0, 8);
  const bestSeller = [...products].sort((a, b) => b.sold_count - a.sold_count).slice(0, 8);
  const stripBanners = banners.filter((b) => b.placement === "home_strip");

  return (
    <div className="bg-[var(--brand-bg)] pb-12">
      <div className="shop-container pt-4">
        <HomeBannerCarousel banners={banners} />
      </div>

      <section className="shop-container">
        <HomeCategoryTrends categories={categories} />
      </section>

      {stripBanners.length ? (
        <div className="shop-container mt-4 flex gap-3 overflow-x-auto pb-1">
          {stripBanners.map((b) => (
            <Link
              key={b.id}
              href={b.link_url}
              className="shrink-0 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-[var(--brand-primary)] shadow-sm transition hover:border-[var(--brand-accent)] hover:shadow-md"
            >
              {b.title}
            </Link>
          ))}
        </div>
      ) : null}

      <div className="shop-container">
        <FlashSaleSection
          promotion={flash.promotion}
          products={flashProducts.length ? flashProducts : featured}
          promoProducts={flash.products}
        />
      </div>

      <section className="shop-container mt-8">
        <h2 className="text-lg font-bold text-[var(--brand-text)]">Gợi ý hôm nay</h2>
        <div className="product-grid-tl mt-4">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      <section className="shop-container mt-10">
        <h2 className="text-lg font-bold">Bán chạy</h2>
        <div className="product-grid-tl mt-4">
          {bestSeller.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      <section className="shop-container mt-10 rounded-xl brand-gradient-bg p-6 text-white">
        <h2 className="text-xl font-bold">Doanh nghiệp & trường học</h2>
        <p className="mt-2 max-w-xl text-sm text-white/90">{VPPACA_BRAND.aboutIntro}</p>
        <Link
          href="/bao-gia-doanh-nghiep"
          className="mt-4 inline-flex rounded-lg bg-white px-5 py-2.5 text-sm font-bold text-[var(--brand-primary)]"
        >
          Nhận báo giá B2B
        </Link>
      </section>
    </div>
  );
}
