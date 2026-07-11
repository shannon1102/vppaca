import { notFound } from "next/navigation";
import { ProductForm } from "@/components/admin/product-form";
import { FormErrorBanner } from "@/components/admin/form-error-banner";
import { requireAdminPage } from "@/lib/require-admin";
import { repo } from "@/lib/data/repository";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
};

export default async function EditProductPage({ params, searchParams }: Props) {
  await requireAdminPage();
  const { id } = await params;
  const { error } = await searchParams;
  const [product, categories] = await Promise.all([
    repo.getProductById(id),
    repo.listCategories(),
  ]);
  if (!product) notFound();

  return (
    <div>
      <h1 className="text-3xl font-bold">Sửa sản phẩm</h1>
      <FormErrorBanner code={error} />
      <ProductForm product={product} categories={categories} />
    </div>
  );
}
