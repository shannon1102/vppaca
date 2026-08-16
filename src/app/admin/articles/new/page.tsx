import { ArticleForm } from "@/components/admin/article-form";
import { FormErrorBanner } from "@/components/admin/form-error-banner";
import { isAtArticleLimit } from "@/lib/catalog-limits";
import { requireAdminPage } from "@/lib/require-admin";
import { repo } from "@/lib/data/repository";
import { redirect } from "next/navigation";

export default async function NewArticlePage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  await requireAdminPage();
  const { error } = await searchParams;
  const articles = await repo.listArticles();
  if (isAtArticleLimit(articles.length)) {
    redirect("/admin/articles?error=article-limit");
  }
  return (
    <div>
      <h1 className="text-3xl font-bold">Thêm bài viết sức khỏe</h1>
      <FormErrorBanner code={error} />
      <ArticleForm article={{ is_published: false, tags: [] }} />
    </div>
  );
}
