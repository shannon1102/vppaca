import { promises as fs } from "fs";
import path from "path";
import { defaultSettings, seedArticles, seedCategories, seedProducts } from "@/data/seed";
import type { Category, HealthArticle, Order, Product, SiteSettings } from "@/lib/types";

const DATA_DIR = path.join(process.cwd(), ".data");

type LocalDb = {
  settings: SiteSettings;
  categories: Category[];
  products: Product[];
  orders: Order[];
  articles: HealthArticle[];
};

async function ensureDb(): Promise<LocalDb> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  const file = path.join(DATA_DIR, "store.json");
  try {
    const raw = await fs.readFile(file, "utf8");
    const db = JSON.parse(raw) as LocalDb;
    if (!db.articles) db.articles = seedArticles;
    db.products = db.products.map((p) => ({
      ...p,
      detail_description: p.detail_description ?? "",
      sold_count: p.sold_count ?? 0,
    }));
    return db;
  } catch {
    const initial: LocalDb = {
      settings: defaultSettings,
      categories: seedCategories,
      products: seedProducts,
      orders: [],
      articles: seedArticles,
    };
    await fs.writeFile(file, JSON.stringify(initial, null, 2), "utf8");
    return initial;
  }
}

async function saveDb(db: LocalDb) {
  const file = path.join(DATA_DIR, "store.json");
  await fs.writeFile(file, JSON.stringify(db, null, 2), "utf8");
}

export async function localGetSettings(): Promise<SiteSettings> {
  const db = await ensureDb();
  return db.settings;
}

export async function localUpdateSettings(
  patch: Partial<SiteSettings>,
): Promise<SiteSettings> {
  const db = await ensureDb();
  db.settings = { ...db.settings, ...patch, id: db.settings.id };
  await saveDb(db);
  return db.settings;
}

export async function localListCategories(): Promise<Category[]> {
  const db = await ensureDb();
  return [...db.categories].sort((a, b) => a.sort - b.sort);
}

export async function localUpsertCategory(cat: Category): Promise<Category> {
  const db = await ensureDb();
  const i = db.categories.findIndex((c) => c.id === cat.id);
  if (i >= 0) db.categories[i] = cat;
  else db.categories.push(cat);
  await saveDb(db);
  return cat;
}

export async function localDeleteCategory(id: string): Promise<void> {
  const db = await ensureDb();
  db.categories = db.categories.filter((c) => c.id !== id);
  await saveDb(db);
}

export async function localListProducts(opts?: {
  publishedOnly?: boolean;
  categorySlug?: string;
}): Promise<Product[]> {
  const db = await ensureDb();
  let list = [...db.products];
  if (opts?.publishedOnly) list = list.filter((p) => p.is_published);
  if (opts?.categorySlug) {
    const cat = db.categories.find((c) => c.slug === opts.categorySlug);
    if (cat) list = list.filter((p) => p.category_id === cat.id);
  }
  return list;
}

export async function localListRelatedProducts(
  categoryId: string,
  excludeId: string,
  limit = 4,
): Promise<Product[]> {
  const db = await ensureDb();
  return db.products
    .filter(
      (p) =>
        p.category_id === categoryId &&
        p.is_published &&
        p.id !== excludeId,
    )
    .slice(0, limit);
}

export async function localGetProductBySlug(
  slug: string,
  publishedOnly = true,
): Promise<Product | null> {
  const db = await ensureDb();
  const p = db.products.find((x) => x.slug === slug);
  if (!p) return null;
  if (publishedOnly && !p.is_published) return null;
  return p;
}

export async function localGetProductById(id: string): Promise<Product | null> {
  const db = await ensureDb();
  return db.products.find((x) => x.id === id) ?? null;
}

export async function localUpsertProduct(product: Product): Promise<Product> {
  const db = await ensureDb();
  if (db.products.some((p) => p.sku === product.sku && p.id !== product.id)) {
    throw new Error("duplicate_sku");
  }
  if (db.products.some((p) => p.slug === product.slug && p.id !== product.id)) {
    throw new Error("duplicate_slug");
  }
  const i = db.products.findIndex((p) => p.id === product.id);
  if (i >= 0) db.products[i] = product;
  else db.products.push(product);
  await saveDb(db);
  return product;
}

export async function localDeleteProduct(id: string): Promise<void> {
  const db = await ensureDb();
  db.products = db.products.filter((p) => p.id !== id);
  await saveDb(db);
}

export async function localCreateOrder(order: Order): Promise<Order> {
  const db = await ensureDb();
  db.orders.unshift(order);
  const totals = new Map<string, number>();
  for (const item of order.items) {
    if (!item.product_id) continue;
    totals.set(item.product_id, (totals.get(item.product_id) ?? 0) + item.qty);
  }
  for (const [productId, qty] of totals) {
    const product = db.products.find((p) => p.id === productId);
    if (product) product.sold_count = (product.sold_count ?? 0) + qty;
  }
  await saveDb(db);
  return order;
}

export async function localListOrders(): Promise<Order[]> {
  const db = await ensureDb();
  return [...db.orders];
}

export async function localGetOrderByCode(code: string): Promise<Order | null> {
  const db = await ensureDb();
  return db.orders.find((o) => o.code === code) ?? null;
}

export async function localUpdateOrderStatus(
  id: string,
  status: Order["status"],
): Promise<Order | null> {
  const db = await ensureDb();
  const o = db.orders.find((x) => x.id === id);
  if (!o) return null;
  o.status = status;
  await saveDb(db);
  return o;
}

export async function localListArticles(opts?: {
  publishedOnly?: boolean;
}): Promise<HealthArticle[]> {
  const db = await ensureDb();
  let list = [...db.articles].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );
  if (opts?.publishedOnly) list = list.filter((a) => a.is_published);
  return list;
}

export async function localGetArticleBySlug(
  slug: string,
  publishedOnly = true,
): Promise<HealthArticle | null> {
  const db = await ensureDb();
  const a = db.articles.find((x) => x.slug === slug);
  if (!a) return null;
  if (publishedOnly && !a.is_published) return null;
  return a;
}

export async function localGetArticleById(id: string): Promise<HealthArticle | null> {
  const db = await ensureDb();
  return db.articles.find((x) => x.id === id) ?? null;
}

export async function localUpsertArticle(article: HealthArticle): Promise<HealthArticle> {
  const db = await ensureDb();
  const i = db.articles.findIndex((a) => a.id === article.id);
  if (i >= 0) db.articles[i] = article;
  else db.articles.push(article);
  await saveDb(db);
  return article;
}

export async function localDeleteArticle(id: string): Promise<void> {
  const db = await ensureDb();
  db.articles = db.articles.filter((a) => a.id !== id);
  await saveDb(db);
}
