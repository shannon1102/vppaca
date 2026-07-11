import { saveArticleAction } from "@/app/actions";
import { ArticleCoverField } from "@/components/admin/article-cover-field";
import { NameSlugFields } from "@/components/admin/name-slug-fields";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { HealthArticle } from "@/lib/types";

export function ArticleForm({
  article,
}: {
  article: Partial<HealthArticle> & { id?: string };
}) {
  return (
    <form action={saveArticleAction} className="mt-6 max-w-3xl space-y-4">
      {article.id ? <input type="hidden" name="id" value={article.id} /> : null}
      {article.created_at ? (
        <input type="hidden" name="created_at" value={article.created_at} />
      ) : null}
      <NameSlugFields
        nameField="title"
        nameLabel="Tiêu đề"
        slugLabel="Slug (URL)"
        pathPreview="/bai-viet-suc-khoe"
        defaultName={article.title}
        defaultSlug={article.slug}
      />
      <label className="block space-y-1.5 text-sm">
        <span className="font-medium">Tóm tắt</span>
        <textarea
          name="excerpt"
          rows={2}
          defaultValue={article.excerpt}
          className="w-full rounded-[var(--radius)] border border-slate-200 px-3 py-2"
          placeholder="Mô tả ngắn hiển thị trên danh sách bài viết"
        />
      </label>
      <RichTextEditor
        name="content"
        label="Nội dung"
        defaultValue={article.content}
        height={480}
      />
      <ArticleCoverField defaultValue={article.cover_image_url} />
      <Input
        name="tags"
        label="Tags (phân cách bằng dấu phẩy, tối đa 5)"
        defaultValue={(article.tags ?? []).join(", ")}
      />
      <Input name="seo_title" label="SEO title" defaultValue={article.seo_title} />
      <Input
        name="seo_description"
        label="SEO description"
        defaultValue={article.seo_description}
      />
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          name="is_published"
          defaultChecked={article.is_published}
        />
        Xuất bản
      </label>
      <Button type="submit">Lưu bài viết</Button>
    </form>
  );
}
