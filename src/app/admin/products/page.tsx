import Link from "next/link";
import { deleteProductAction } from "@/app/actions";
import { PendingTextSubmit } from "@/components/admin/form-pending";
import { Button } from "@/components/ui/button";
import { formatVnd } from "@/lib/format";
import { requireAdminPage } from "@/lib/require-admin";
import { repo } from "@/lib/data/repository";

export default async function AdminProductsPage() {
  await requireAdminPage();
  const products = await repo.listProducts();

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-3xl font-bold">Sản phẩm</h1>
        <Link href="/admin/products/new">
          <Button>Thêm sản phẩm</Button>
        </Link>
      </div>
      <div className="mt-6 overflow-x-auto rounded-[var(--radius)] border border-slate-200 bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b bg-slate-50 text-[var(--brand-muted)]">
            <tr>
              <th className="px-4 py-3">Tên</th>
              <th className="px-4 py-3">SKU</th>
              <th className="px-4 py-3">Giá</th>
              <th className="px-4 py-3">Published</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-b last:border-0">
                <td className="px-4 py-3 font-medium">{p.name}</td>
                <td className="px-4 py-3">{p.sku}</td>
                <td className="px-4 py-3">{formatVnd(p.price)}</td>
                <td className="px-4 py-3">{p.is_published ? "Có" : "Không"}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <Link
                      href={`/admin/products/${p.id}`}
                      className="text-[var(--brand-primary)] underline"
                    >
                      Sửa
                    </Link>
                    <form action={deleteProductAction}>
                      <input type="hidden" name="id" value={p.id} />
                      <PendingTextSubmit>Xóa</PendingTextSubmit>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
