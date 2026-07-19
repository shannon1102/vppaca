import { deleteCategoryAction } from "@/app/actions";
import { CategoryForm } from "@/components/admin/category-form";
import { PendingTextSubmit } from "@/components/admin/form-pending";
import { requireAdminPage } from "@/lib/require-admin";
import { repo } from "@/lib/data/repository";

export default async function AdminCategoriesPage() {
  await requireAdminPage();
  const categories = await repo.listCategories();

  return (
    <div className="grid gap-10 lg:grid-cols-2">
      <div>
        <h1 className="text-3xl font-bold">Danh mục</h1>
        <ul className="mt-6 space-y-3">
          {categories.map((c) => (
            <li
              key={c.id}
              className="flex items-start justify-between gap-3 rounded-[var(--radius)] border border-slate-200 bg-white p-4"
            >
              <div>
                <p className="font-semibold">{c.name}</p>
                <p className="text-xs text-[var(--brand-muted)]">{c.slug}</p>
              </div>
              <form action={deleteCategoryAction}>
                <input type="hidden" name="id" value={c.id} />
                <PendingTextSubmit>Xóa</PendingTextSubmit>
              </form>
            </li>
          ))}
        </ul>
      </div>
      <div className="rounded-[var(--radius)] border border-slate-200 bg-white p-6">
        <h2 className="text-xl font-semibold">Thêm / cập nhật danh mục</h2>
        <CategoryForm />
      </div>
    </div>
  );
}
