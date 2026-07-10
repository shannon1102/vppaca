import { ArticleForm } from "@/components/admin/article-form";
import { requireAdminPage } from "@/lib/require-admin";

export default async function NewArticlePage() {
  await requireAdminPage();
  return (
    <div>
      <h1 className="text-3xl font-bold">Thêm bài viết sức khỏe</h1>
      <ArticleForm article={{ is_published: false, tags: [] }} />
    </div>
  );
}
