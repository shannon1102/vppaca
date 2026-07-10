import { notFound } from "next/navigation";
import { ProductForm } from "@/components/admin/product-form";
import { requireAdminPage } from "@/lib/require-admin";
import { repo } from "@/lib/data/repository";

type Props = { params: Promise<{ id: string }> };

export default async function EditProductPage({ params }: Props) {
  await requireAdminPage();
  const { id } = await params;
  const [product, categories] = await Promise.all([
    repo.getProductById(id),
    repo.listCategories(),
  ]);
  if (!product) notFound();

  return (
    <div>
      <h1 className="text-3xl font-bold">Sửa sản phẩm</h1>
      <ProductForm product={product} categories={categories} />
    </div>
  );
}
