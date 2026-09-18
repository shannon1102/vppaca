import { parseCatalogPage } from "@/lib/catalog/list-products-page";
import { repo, vppGetActiveFlashSale } from "@/lib/data/repository";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const sp = Object.fromEntries(url.searchParams.entries());

  const page = parseCatalogPage(sp.page);
  const pageSizeRaw = Number(sp.pageSize);
  const pageSize =
    Number.isFinite(pageSizeRaw) && pageSizeRaw > 0
      ? Math.min(Math.floor(pageSizeRaw), 100)
      : undefined;

  const categorySlug = sp.categorySlug?.trim() || undefined;
  const publishedOnly = sp.publishedOnly !== "0";

  const flash = await vppGetActiveFlashSale();
  const result = await repo.listProductsPage({
    publishedOnly,
    categorySlug,
    filters: {
      q: sp.q,
      brand: sp.brand,
      sale: sp.sale,
      sort: sp.sort,
      minPrice: sp.minPrice,
      maxPrice: sp.maxPrice,
    },
    promoProducts: flash.products,
    page,
    pageSize,
  });

  return Response.json(result);
}
