import { ArticleCard } from "@/components/store/article-card";
import { repo } from "@/lib/data/repository";
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
    <div className="shop-container py-10">
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
            <ArticleCard key={a.id} article={a} />
          ))}
        </div>
      )}
    </div>
  );
}
