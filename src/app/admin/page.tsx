import { DashboardStats } from "@/components/admin/dashboard-stats";
import { requireAdminPage } from "@/lib/require-admin";
import { repo } from "@/lib/data/repository";

export default async function AdminHomePage() {
  await requireAdminPage();
  const [products, orders, articles, settings] = await Promise.all([
    repo.listProducts(),
    repo.listOrders(),
    repo.listArticles(),
    repo.getSettings(),
  ]);

  return (
    <DashboardStats
      products={products}
      orders={orders}
      articles={articles}
      shopName={settings.shop_name}
    />
  );
}
