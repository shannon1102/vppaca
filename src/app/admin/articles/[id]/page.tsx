import { notFound } from "next/navigation";
import { ArticleForm } from "@/components/admin/article-form";
import { requireAdminPage } from "@/lib/require-admin";
import { repo } from "@/lib/data/repository";

type Props = { params: Promise<{ id: string }> };

export default async function EditArticlePage({ params }: Props) {
  await requireAdminPage();
  const { id } = await params;
  const article = await repo.getArticleById(id);
  if (!article) notFound();

  return (
    <div>
      <h1 className="text-3xl font-bold">Sửa bài viết</h1>
      <ArticleForm article={article} />
    </div>
  );
}
