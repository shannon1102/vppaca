import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { repo } from "@/lib/data/repository";
import { normalizeImageSrc } from "@/lib/media/helpers";
import { pageMetadata } from "@/lib/seo/metadata";

export const revalidate = 300;

export const metadata = pageMetadata({
  title: "Bài viết sức khỏe",
  description:
    "Kiến thức y tế, hướng dẫn sử dụng thiết bị và chăm sóc sức khỏe tại nhà.",
  path: "/bai-viet-suc-khoe",
});

export default async function HealthArticlesPage() {
  const articles = await repo.listArticles({ publishedOnly: true });

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="max-w-2xl">
        <h1 className="text-3xl font-bold md:text-4xl">Bài viết sức khỏe</h1>
        <p className="mt-3 text-[var(--brand-muted)]">
          Kiến thức y tế, mẹo chăm sóc sức khỏe và hướng dẫn sử dụng thiết bị y tế tại nhà.
        </p>
      </div>

      {articles.length === 0 ? (
        <p className="mt-12 text-[var(--brand-muted)]">Chưa có bài viết nào.</p>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((a) => (
            <Link
              key={a.id}
              href={`/bai-viet-suc-khoe/${a.slug}`}
              className="group overflow-hidden rounded-[var(--radius)] border border-slate-200 bg-white transition hover:border-[var(--brand-primary)] hover:shadow-md"
            >
              {a.cover_image_url ? (
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                  <Image
                    src={normalizeImageSrc(a.cover_image_url)}
                    alt={a.title}
                    fill
                    className="object-cover transition group-hover:scale-105"
                    sizes="(max-width:768px) 100vw, 33vw"
                  />
                </div>
              ) : null}
              <div className="p-5">
                <div className="flex flex-wrap gap-1.5">
                  {a.tags.slice(0, 3).map((t) => (
                    <Badge key={t}>{t}</Badge>
                  ))}
                </div>
                <h2 className="mt-3 text-lg font-bold leading-snug group-hover:text-[var(--brand-primary)]">
                  {a.title}
                </h2>
                {a.excerpt ? (
                  <p className="mt-2 line-clamp-3 text-sm text-[var(--brand-muted)]">
                    {a.excerpt}
                  </p>
                ) : null}
                <time
                  dateTime={a.created_at}
                  className="mt-4 block text-xs text-[var(--brand-muted)]"
                >
                  {new Date(a.created_at).toLocaleDateString("vi-VN")}
                </time>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
