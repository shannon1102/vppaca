import { saveArticleAction } from "@/app/actions";
import { ArticleCoverField } from "@/components/admin/article-cover-field";
import {
  FormBusyBar,
  FormBusyFence,
  PendingSubmitButton,
} from "@/components/admin/form-pending";
import { NameSlugFields } from "@/components/admin/name-slug-fields";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FORM_LIMITS } from "@/lib/form-limits";
import type { HealthArticle } from "@/lib/types";

export function ArticleForm({
  article,
}: {
  article: Partial<HealthArticle> & { id?: string };
}) {
  return (
    <form action={saveArticleAction} className="mt-6 max-w-3xl space-y-4">
      <FormBusyBar />
      <FormBusyFence className="space-y-4">
        {article.id ? <input type="hidden" name="id" value={article.id} /> : null}
        {article.created_at ? (
          <input type="hidden" name="created_at" value={article.created_at} />
        ) : null}
        <NameSlugFields
          nameField="title"
          nameLabel="Tiêu đề"
          pathPreview="/bai-viet-suc-khoe"
          defaultName={article.title}
          maxLength={FORM_LIMITS.title}
        />
        <Textarea
          name="excerpt"
          label="Tóm tắt"
          rows={2}
          defaultValue={article.excerpt}
          maxLength={FORM_LIMITS.excerpt}
          placeholder="Mô tả ngắn hiển thị trên danh sách bài viết"
        />
        <RichTextEditor
          name="content"
          label="Nội dung"
          defaultValue={article.content}
          height={480}
          maxLength={FORM_LIMITS.richHtml}
        />
        <ArticleCoverField defaultValue={article.cover_image_url} />
        <Input
          name="tags"
          label="Tags (phân cách bằng dấu phẩy, tối đa 5)"
          defaultValue={(article.tags ?? []).join(", ")}
          maxLength={FORM_LIMITS.tags}
        />
        <Input
          name="seo_title"
          label="SEO title"
          defaultValue={article.seo_title}
          maxLength={FORM_LIMITS.seoTitle}
        />
        <Input
          name="seo_description"
          label="SEO description"
          defaultValue={article.seo_description}
          maxLength={FORM_LIMITS.seoDescription}
        />
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            name="is_published"
            defaultChecked={article.is_published}
          />
          Xuất bản
        </label>
      </FormBusyFence>
      <PendingSubmitButton>Lưu bài viết</PendingSubmitButton>
    </form>
  );
}
