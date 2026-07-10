import {
  localCreateOrder,
  localDeleteArticle,
  localDeleteCategory,
  localDeleteProduct,
  localGetArticleById,
  localGetArticleBySlug,
  localGetOrderByCode,
  localGetProductById,
  localGetProductBySlug,
  localGetSettings,
  localListArticles,
  localListCategories,
  localListOrders,
  localListProducts,
  localListRelatedProducts,
  localUpdateOrderStatus,
  localUpdateSettings,
  localUpsertArticle,
  localUpsertCategory,
  localUpsertProduct,
} from "@/lib/data/local-store";
import {
  sbCreateOrder,
  sbDeleteArticle,
  sbDeleteCategory,
  sbDeleteProduct,
  sbEnsureSeed,
  sbGetArticleById,
  sbGetArticleBySlug,
  sbGetOrderByCode,
  sbGetProductById,
  sbGetProductBySlug,
  sbGetSettings,
  sbListArticles,
  sbListCategories,
  sbListOrders,
  sbListProducts,
  sbListRelatedProducts,
  sbUpdateOrderStatus,
  sbUpdateSettings,
  sbUpsertArticle,
  sbUpsertCategory,
  sbUpsertProduct,
} from "@/lib/data/supabase-store";
import { cachedRepo } from "@/lib/data/cached-repo";
import type { Category, HealthArticle, Order, Product, SiteSettings } from "@/lib/types";

export function isSupabaseConfigured(): boolean {
  const url =
    process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_SECRET_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.SUPABASE_ANON_KEY;
  return Boolean(url && key && process.env.USE_SUPABASE !== "false");
}

let seedPromise: Promise<void> | null = null;

async function withSeed<T>(fn: () => Promise<T>): Promise<T> {
  if (isSupabaseConfigured()) {
    if (!seedPromise) seedPromise = sbEnsureSeed().catch((e) => {
      seedPromise = null;
      throw e;
    });
    await seedPromise;
  }
  return fn();
}

export const repo = {
  getSettings: (): Promise<SiteSettings> => cachedRepo.getSettings(),
  updateSettings: (patch: Partial<SiteSettings>) =>
    isSupabaseConfigured()
      ? withSeed(() => sbUpdateSettings(patch))
      : localUpdateSettings(patch),
  listCategories: (): Promise<Category[]> => cachedRepo.listCategories(),
  upsertCategory: (c: Category) =>
    isSupabaseConfigured()
      ? withSeed(() => sbUpsertCategory(c))
      : localUpsertCategory(c),
  deleteCategory: (id: string) =>
    isSupabaseConfigured()
      ? withSeed(() => sbDeleteCategory(id))
      : localDeleteCategory(id),
  listProducts: (opts?: { publishedOnly?: boolean; categorySlug?: string }) =>
    cachedRepo.listProducts(opts),
  getProductBySlug: (slug: string, publishedOnly = true) =>
    cachedRepo.getProductBySlug(slug, publishedOnly),
  listRelatedProducts: (categoryId: string, excludeId: string, limit = 4) =>
    cachedRepo.listRelatedProducts(categoryId, excludeId, limit),
  getProductById: (id: string) =>
    isSupabaseConfigured()
      ? withSeed(() => sbGetProductById(id))
      : localGetProductById(id),
  upsertProduct: (p: Product) =>
    isSupabaseConfigured()
      ? withSeed(() => sbUpsertProduct(p))
      : localUpsertProduct(p),
  deleteProduct: (id: string) =>
    isSupabaseConfigured()
      ? withSeed(() => sbDeleteProduct(id))
      : localDeleteProduct(id),
  createOrder: (o: Order) =>
    isSupabaseConfigured()
      ? withSeed(() => sbCreateOrder(o))
      : localCreateOrder(o),
  listOrders: () =>
    isSupabaseConfigured()
      ? withSeed(() => sbListOrders())
      : localListOrders(),
  getOrderByCode: (code: string) =>
    isSupabaseConfigured()
      ? withSeed(() => sbGetOrderByCode(code))
      : localGetOrderByCode(code),
  updateOrderStatus: (id: string, status: Order["status"]) =>
    isSupabaseConfigured()
      ? withSeed(() => sbUpdateOrderStatus(id, status))
      : localUpdateOrderStatus(id, status),
  listArticles: (opts?: { publishedOnly?: boolean }) =>
    cachedRepo.listArticles(opts),
  getArticleBySlug: (slug: string, publishedOnly = true) =>
    cachedRepo.getArticleBySlug(slug, publishedOnly),
  getArticleById: (id: string) =>
    isSupabaseConfigured()
      ? withSeed(() => sbGetArticleById(id))
      : localGetArticleById(id),
  upsertArticle: (a: HealthArticle) =>
    isSupabaseConfigured()
      ? withSeed(() => sbUpsertArticle(a))
      : localUpsertArticle(a),
  deleteArticle: (id: string) =>
    isSupabaseConfigured()
      ? withSeed(() => sbDeleteArticle(id))
      : localDeleteArticle(id),
};
