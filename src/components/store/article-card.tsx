import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { normalizeImageSrc } from "@/lib/media/helpers";
import type { HealthArticle } from "@/lib/types";

export function ArticleCard({ article }: { article: HealthArticle }) {
  return (
    <Link
      href={`/bai-viet-suc-khoe/${article.slug}`}
      className="group overflow-hidden rounded-[var(--radius)] border border-slate-200 bg-white transition hover:border-[var(--brand-primary)] hover:shadow-md"
    >
      {article.cover_image_url ? (
        <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
          <Image
            src={normalizeImageSrc(article.cover_image_url)}
            alt={article.title}
            fill
            className="object-cover transition group-hover:scale-105"
            sizes="(max-width:768px) 100vw, 33vw"
          />
        </div>
      ) : null}
      <div className="p-5">
        <div className="flex flex-wrap gap-1.5">
          {article.tags.slice(0, 3).map((t) => (
            <Badge key={t}>{t}</Badge>
          ))}
        </div>
        <h2 className="mt-3 text-lg font-bold leading-snug group-hover:text-[var(--brand-primary)]">
          {article.title}
        </h2>
        {article.excerpt ? (
          <p className="mt-2 line-clamp-3 text-sm text-[var(--brand-muted)]">
            {article.excerpt}
          </p>
        ) : null}
        <time
          dateTime={article.created_at}
          className="mt-4 block text-xs text-[var(--brand-muted)]"
        >
          {new Date(article.created_at).toLocaleDateString("vi-VN")}
        </time>
      </div>
    </Link>
  );
}
