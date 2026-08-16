import Link from "next/link";
import { deleteArticleAction } from "@/app/actions";
import { PendingTextSubmit } from "@/components/admin/form-pending";
import { Button } from "@/components/ui/button";
import {
  CATALOG_LIMITS,
  formatCatalogUsage,
  isAtArticleLimit,
} from "@/lib/catalog-limits";
import { requireAdminPage } from "@/lib/require-admin";
import { repo } from "@/lib/data/repository";

export default async function AdminArticlesPage() {
  await requireAdminPage();
  const articles = await repo.listArticles();
  const atLimit = isAtArticleLimit(articles.length);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Bài viết sức khỏe</h1>
          <p className="mt-1 text-sm text-[var(--brand-muted)]">
            {formatCatalogUsage(articles.length, CATALOG_LIMITS.maxArticles)} bài viết
          </p>
        </div>
        {atLimit ? (
          <Button disabled title="Đã đạt giới hạn 50 bài viết">
            Thêm bài viết
          </Button>
        ) : (
          <Link href="/admin/articles/new">
            <Button>Thêm bài viết</Button>
          </Link>
        )}
      </div>
      <div className="mt-6 overflow-x-auto rounded-[var(--radius)] border border-slate-200 bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b bg-slate-50 text-[var(--brand-muted)]">
            <tr>
              <th className="px-4 py-3">Tiêu đề</th>
              <th className="px-4 py-3">Tags</th>
              <th className="px-4 py-3">Published</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {articles.map((a) => (
              <tr key={a.id} className="border-b last:border-0">
                <td className="px-4 py-3 font-medium">{a.title}</td>
                <td className="px-4 py-3 text-[var(--brand-muted)]">
                  {a.tags.join(", ") || "—"}
                </td>
                <td className="px-4 py-3">{a.is_published ? "Có" : "Không"}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <Link
                      href={`/admin/articles/${a.id}`}
                      className="text-[var(--brand-primary)] underline"
                    >
                      Sửa
                    </Link>
                    <form action={deleteArticleAction}>
                      <input type="hidden" name="id" value={a.id} />
                      <PendingTextSubmit>Xóa</PendingTextSubmit>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {articles.length === 0 ? (
          <p className="px-4 py-8 text-center text-[var(--brand-muted)]">
            Chưa có bài viết.{" "}
            <Link href="/admin/articles/new" className="text-[var(--brand-primary)] underline">
              Tạo bài đầu tiên
            </Link>
          </p>
        ) : null}
      </div>
    </div>
  );
}
