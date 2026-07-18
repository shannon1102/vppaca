import { ProductForm } from "@/components/admin/product-form";
import { FormErrorBanner } from "@/components/admin/form-error-banner";
import { requireAdminPage } from "@/lib/require-admin";
import { repo } from "@/lib/data/repository";
import type { Product } from "@/lib/types";

export default async function NewProductPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  await requireAdminPage();
  const { error } = await searchParams;
  const categories = await repo.listCategories();
  const blank: Partial<Product> = {
    name: "",
    slug: "",
    sku: "",
    price: 0,
    sale_price: null,
    description: "",
    specs: {},
    category_id: categories[0]?.id ?? "",
    images: ["/seed/product-01.svg"],
    stock: 0,
    sold_count: 10,
    is_published: true,
    is_featured: false,
    seo_title: "",
    seo_description: "",
  };

  return (
    <div>
      <h1 className="text-3xl font-bold">Thêm sản phẩm</h1>
      <FormErrorBanner code={error} />
      <ProductForm categories={categories} product={blank} />
    </div>
  );
}
