import { saveProductAction } from "@/app/actions";
import { NameSlugFields } from "@/components/admin/name-slug-fields";
import { ProductImageFields } from "@/components/admin/product-image-fields";
import { ProductSpecsFields } from "@/components/admin/product-specs-fields";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Category, Product } from "@/lib/types";

export function ProductForm({
  product,
  categories,
}: {
  product: Partial<Product> & { id?: string };
  categories: Category[];
}) {
  return (
    <form action={saveProductAction} className="mt-6 max-w-3xl space-y-4">
      {product.id ? <input type="hidden" name="id" value={product.id} /> : null}
      <NameSlugFields
        nameField="name"
        nameLabel="Tên"
        slugLabel="Slug (URL)"
        pathPreview="/san-pham"
        defaultName={product.name}
        defaultSlug={product.slug}
      />
      <Input name="sku" label="SKU" required defaultValue={product.sku} />
      <Input
        name="price"
        type="number"
        label="Giá"
        required
        defaultValue={product.price ?? 0}
      />
      <Input
        name="sale_price"
        type="number"
        label="Giá khuyến mãi"
        defaultValue={product.sale_price ?? ""}
      />
      <Input
        name="stock"
        type="number"
        label="Tồn kho"
        defaultValue={product.stock ?? 0}
      />
      <label className="block space-y-1.5 text-sm">
        <span className="font-medium">Danh mục</span>
        <select
          name="category_id"
          defaultValue={product.category_id}
          className="min-h-11 w-full rounded-[var(--radius)] border border-slate-200 px-3"
        >
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </label>
      <label className="block space-y-1.5 text-sm">
        <span className="font-medium">Mô tả ngắn</span>
        <textarea
          name="description"
          rows={4}
          defaultValue={product.description}
          placeholder="Mô tả ngắn hiển thị cạnh giá trên trang sản phẩm"
          className="w-full rounded-[var(--radius)] border border-slate-200 px-3 py-2"
        />
      </label>
      <RichTextEditor
        name="detail_description"
        label="Mô tả chi tiết"
        defaultValue={product.detail_description}
        height={360}
      />
      <ProductImageFields defaultImages={product.images} />
      <ProductSpecsFields specs={product.specs} />
      <Input name="seo_title" label="SEO title" defaultValue={product.seo_title} />
      <Input
        name="seo_description"
        label="SEO description"
        defaultValue={product.seo_description}
      />
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          name="is_published"
          defaultChecked={product.is_published}
        />
        Published
      </label>
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          name="is_featured"
          defaultChecked={product.is_featured}
        />
        Featured
      </label>
      <Button type="submit">Lưu sản phẩm</Button>
    </form>
  );
}
