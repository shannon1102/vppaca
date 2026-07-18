import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-jsonld";
import { Badge } from "@/components/ui/badge";
import { RichContent } from "@/components/ui/rich-content";
import { repo } from "@/lib/data/repository";
import { stripHtml } from "@/lib/format";
import { normalizeImageSrc } from "@/lib/media/helpers";
import { absoluteUrl } from "@/lib/seo/jsonld";
import { noindexMetadata, pageMetadata } from "@/lib/seo/metadata";

export const revalidate = 300;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await repo.getArticleBySlug(slug);
  if (!article) return noindexMetadata("Bài viết sức khỏe", "Bài viết không tồn tại.");
  const cover = article.cover_image_url
    ? normalizeImageSrc(article.cover_image_url)
    : undefined;
  return pageMetadata({
    title: article.seo_title || article.title,
    description: article.seo_description || article.excerpt,
    path: `/bai-viet-suc-khoe/${slug}`,
    image: cover,
    openGraphType: "article",
    publishedTime: article.created_at,
    modifiedTime: article.updated_at,
  });
}

export default async function HealthArticleDetailPage({ params }: Props) {
  const { slug } = await params;
  const article = await repo.getArticleBySlug(slug);
  if (!article) notFound();

  const settings = await repo.getSettings();
  const coverUrl = article.cover_image_url
    ? normalizeImageSrc(article.cover_image_url)
    : null;
  const articleUrl = absoluteUrl(`/bai-viet-suc-khoe/${article.slug}`);
  const logoUrl = absoluteUrl(settings.logo_url || "/brand/tam-duc-logo.png");
  const coverAbs = coverUrl ? absoluteUrl(coverUrl) : undefined;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: article.title,
    description: article.excerpt || stripHtml(article.content).slice(0, 160),
    image: coverAbs ? [coverAbs] : undefined,
    datePublished: article.created_at,
    dateModified: article.updated_at,
    author: { "@type": "Organization", name: settings.shop_name },
    publisher: {
      "@type": "Organization",
      name: settings.shop_name,
      logo: { "@type": "ImageObject", url: logoUrl },
    },
    mainEntityOfPage: articleUrl,
  };

  return (
    <article className="mx-auto max-w-3xl px-4 py-10">
      <BreadcrumbJsonLd
        items={[
          { name: "Trang chủ", path: "/" },
          { name: "Bài viết sức khỏe", path: "/bai-viet-suc-khoe" },
          { name: article.title, path: `/bai-viet-suc-khoe/${article.slug}` },
        ]}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Link
        href="/bai-viet-suc-khoe"
        className="text-sm text-[var(--brand-primary)] hover:underline"
      >
        ← Tất cả bài viết
      </Link>

      <header className="mt-6">
        <div className="flex flex-wrap gap-2">
          {article.tags.map((t) => (
            <Badge key={t}>{t}</Badge>
          ))}
        </div>
        <h1 className="mt-4 text-3xl font-bold md:text-4xl">{article.title}</h1>
        {article.excerpt ? (
          <p className="mt-4 text-lg text-[var(--brand-muted)]">{article.excerpt}</p>
        ) : null}
        <time
          dateTime={article.created_at}
          className="mt-4 block text-sm text-[var(--brand-muted)]"
        >
          {new Date(article.created_at).toLocaleDateString("vi-VN", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </time>
      </header>

      {coverUrl ? (
        <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-[var(--radius)] border border-slate-200 bg-white">
          <Image
            src={coverUrl}
            alt={article.title}
            fill
            className="object-cover"
            priority
            sizes="(max-width:768px) 100vw, 768px"
          />
        </div>
      ) : null}

      <div className="mt-10">
        <RichContent content={article.content} />
      </div>
    </article>
  );
}
