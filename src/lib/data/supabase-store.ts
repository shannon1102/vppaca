import { createClient } from "@supabase/supabase-js";
import type {
  Category,
  HealthArticle,
  Order,
  OrderItem,
  OrderStatus,
  Product,
  SiteSettings,
} from "@/lib/types";
import { defaultSettings, seedArticles, seedCategories, seedProducts } from "@/data/seed";
import { BRAND_COLORS } from "@/lib/brand-colors";

function adminClient() {
  const url =
    process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_SECRET_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error("Supabase env missing");
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

function isMissingTableError(error: { code?: string; message?: string }): boolean {
  return (
    error.code === "PGRST205" ||
    Boolean(error.message?.includes("Could not find the table"))
  );
}

function mapProduct(row: Record<string, unknown>): Product {
  return {
    id: String(row.id),
    name: String(row.name),
    slug: String(row.slug),
    sku: String(row.sku),
    price: Number(row.price),
    sale_price: row.sale_price == null ? null : Number(row.sale_price),
    description: String(row.description ?? ""),
    detail_description: String(row.detail_description ?? ""),
    specs: (row.specs as Record<string, string>) ?? {},
    category_id: String(row.category_id ?? ""),
    images: (row.images as string[]) ?? [],
    stock: Number(row.stock ?? 0),
    is_published: Boolean(row.is_published),
    is_featured: Boolean(row.is_featured),
    seo_title: String(row.seo_title ?? ""),
    seo_description: String(row.seo_description ?? ""),
  };
}

function mapCategory(row: Record<string, unknown>): Category {
  return {
    id: String(row.id),
    name: String(row.name),
    slug: String(row.slug),
    description: String(row.description ?? ""),
    sort: Number(row.sort ?? 0),
    image_url: row.image_url == null ? null : String(row.image_url),
  };
}

function mapSettings(row: Record<string, unknown>): SiteSettings {
  return {
    id: String(row.id),
    shop_name: String(row.shop_name),
    tagline: String(row.tagline ?? ""),
    phone: String(row.phone ?? ""),
    email: String(row.email ?? ""),
    address: String(row.address ?? ""),
    logo_url: String(row.logo_url ?? ""),
    favicon_url: String(row.favicon_url ?? ""),
    primary_color: String(row.primary_color ?? BRAND_COLORS.primary),
    secondary_color: String(row.secondary_color ?? BRAND_COLORS.secondary),
    accent_color: String(row.accent_color ?? BRAND_COLORS.accent),
    bank_name: String(row.bank_name ?? ""),
    bank_account: String(row.bank_account ?? ""),
    bank_holder: String(row.bank_holder ?? ""),
    transfer_content_template: String(
      row.transfer_content_template ?? "DH {code}",
    ),
    qr_image_url: String(row.qr_image_url ?? ""),
    facebook_url: String(row.facebook_url ?? ""),
    zalo_url: String(row.zalo_url ?? ""),
  };
}

function mapArticle(row: Record<string, unknown>): HealthArticle {
  return {
    id: String(row.id),
    title: String(row.title),
    slug: String(row.slug),
    excerpt: String(row.excerpt ?? ""),
    content: String(row.content ?? ""),
    cover_image_url: row.cover_image_url == null ? null : String(row.cover_image_url),
    tags: (row.tags as string[]) ?? [],
    is_published: Boolean(row.is_published),
    seo_title: String(row.seo_title ?? ""),
    seo_description: String(row.seo_description ?? ""),
    created_at: String(row.created_at),
    updated_at: String(row.updated_at),
  };
}

export async function sbGetSettings(): Promise<SiteSettings> {
  const sb = adminClient();
  const { data, error } = await sb.from("site_settings").select("*").limit(1).maybeSingle();
  if (error) throw error;
  if (!data) return defaultSettings;
  return mapSettings(data as Record<string, unknown>);
}

export async function sbUpdateSettings(
  patch: Partial<SiteSettings>,
): Promise<SiteSettings> {
  const sb = adminClient();
  const current = await sbGetSettings();
  const next = { ...current, ...patch, id: current.id };
  const { id, ...rest } = next;
  if (id === "default") {
    const { data, error } = await sb
      .from("site_settings")
      .insert(rest)
      .select("*")
      .single();
    if (error) throw error;
    return mapSettings(data as Record<string, unknown>);
  }
  const { data, error } = await sb
    .from("site_settings")
    .update(rest)
    .eq("id", id)
    .select("*")
    .single();
  if (error) throw error;
  return mapSettings(data as Record<string, unknown>);
}

export async function sbListCategories(): Promise<Category[]> {
  const sb = adminClient();
  const { data, error } = await sb
    .from("categories")
    .select("*")
    .order("sort", { ascending: true });
  if (error) throw error;
  return (data ?? []).map((r) => mapCategory(r as Record<string, unknown>));
}

export async function sbUpsertCategory(cat: Category): Promise<Category> {
  const sb = adminClient();
  const { data, error } = await sb
    .from("categories")
    .upsert(cat)
    .select("*")
    .single();
  if (error) throw error;
  return mapCategory(data as Record<string, unknown>);
}

export async function sbDeleteCategory(id: string): Promise<void> {
  const sb = adminClient();
  const { error } = await sb.from("categories").delete().eq("id", id);
  if (error) throw error;
}

export async function sbListProducts(opts?: {
  publishedOnly?: boolean;
  categorySlug?: string;
}): Promise<Product[]> {
  const sb = adminClient();
  let categoryId: string | undefined;
  if (opts?.categorySlug) {
    const { data: cat } = await sb
      .from("categories")
      .select("id")
      .eq("slug", opts.categorySlug)
      .maybeSingle();
    categoryId = cat?.id;
  }
  let q = sb.from("products").select("*");
  if (opts?.publishedOnly) q = q.eq("is_published", true);
  if (categoryId) q = q.eq("category_id", categoryId);
  const { data, error } = await q.order("name");
  if (error) throw error;
  return (data ?? []).map((r) => mapProduct(r as Record<string, unknown>));
}

export async function sbListRelatedProducts(
  categoryId: string,
  excludeId: string,
  limit = 4,
): Promise<Product[]> {
  const sb = adminClient();
  const { data, error } = await sb
    .from("products")
    .select("*")
    .eq("category_id", categoryId)
    .eq("is_published", true)
    .neq("id", excludeId)
    .limit(limit);
  if (error) throw error;
  return (data ?? []).map((r) => mapProduct(r as Record<string, unknown>));
}

export async function sbGetProductBySlug(
  slug: string,
  publishedOnly = true,
): Promise<Product | null> {
  const sb = adminClient();
  let q = sb.from("products").select("*").eq("slug", slug);
  if (publishedOnly) q = q.eq("is_published", true);
  const { data, error } = await q.maybeSingle();
  if (error) throw error;
  return data ? mapProduct(data as Record<string, unknown>) : null;
}

export async function sbGetProductById(id: string): Promise<Product | null> {
  const sb = adminClient();
  const { data, error } = await sb
    .from("products")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data ? mapProduct(data as Record<string, unknown>) : null;
}

export async function sbUpsertProduct(product: Product): Promise<Product> {
  const sb = adminClient();
  const { data, error } = await sb
    .from("products")
    .upsert(product)
    .select("*")
    .single();
  if (error) throw error;
  return mapProduct(data as Record<string, unknown>);
}

export async function sbDeleteProduct(id: string): Promise<void> {
  const sb = adminClient();
  const { error } = await sb.from("products").delete().eq("id", id);
  if (error) throw error;
}

export async function sbCreateOrder(order: Order): Promise<Order> {
  const sb = adminClient();
  const { items, ...header } = order;
  const { error: e1 } = await sb.from("orders").insert({
    id: header.id,
    code: header.code,
    customer_name: header.customer_name,
    customer_phone: header.customer_phone,
    customer_email: header.customer_email,
    customer_address: header.customer_address,
    note: header.note,
    status: header.status,
    total: header.total,
    created_at: header.created_at,
  });
  if (e1) throw e1;
  const { error: e2 } = await sb.from("order_items").insert(
    items.map((i: OrderItem) => ({
      id: i.id,
      order_id: i.order_id,
      product_id: i.product_id,
      name: i.name,
      qty: i.qty,
      unit_price: i.unit_price,
    })),
  );
  if (e2) throw e2;
  return order;
}

export async function sbListOrders(): Promise<Order[]> {
  const sb = adminClient();
  const { data: orders, error } = await sb
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  const ids = (orders ?? []).map((o) => o.id);
  if (!ids.length) return [];
  const { data: items, error: e2 } = await sb
    .from("order_items")
    .select("*")
    .in("order_id", ids);
  if (e2) throw e2;
  return (orders ?? []).map((o) => ({
    id: String(o.id),
    code: String(o.code),
    customer_name: String(o.customer_name),
    customer_phone: String(o.customer_phone),
    customer_email: String(o.customer_email ?? ""),
    customer_address: String(o.customer_address),
    note: String(o.note ?? ""),
    status: o.status as OrderStatus,
    total: Number(o.total),
    created_at: String(o.created_at),
    items: (items ?? [])
      .filter((i) => i.order_id === o.id)
      .map((i) => ({
        id: String(i.id),
        order_id: String(i.order_id),
        product_id: String(i.product_id ?? ""),
        name: String(i.name),
        qty: Number(i.qty),
        unit_price: Number(i.unit_price),
      })),
  }));
}

export async function sbGetOrderByCode(code: string): Promise<Order | null> {
  const orders = await sbListOrders();
  return orders.find((o) => o.code === code) ?? null;
}

export async function sbUpdateOrderStatus(
  id: string,
  status: OrderStatus,
): Promise<Order | null> {
  const sb = adminClient();
  const { error } = await sb.from("orders").update({ status }).eq("id", id);
  if (error) throw error;
  const all = await sbListOrders();
  return all.find((o) => o.id === id) ?? null;
}

export async function sbListArticles(opts?: {
  publishedOnly?: boolean;
}): Promise<HealthArticle[]> {
  const sb = adminClient();
  let q = sb.from("health_articles").select("*");
  if (opts?.publishedOnly) q = q.eq("is_published", true);
  const { data, error } = await q.order("created_at", { ascending: false });
  if (error) {
    if (isMissingTableError(error)) return [];
    throw error;
  }
  return (data ?? []).map((r) => mapArticle(r as Record<string, unknown>));
}

export async function sbGetArticleBySlug(
  slug: string,
  publishedOnly = true,
): Promise<HealthArticle | null> {
  const sb = adminClient();
  let q = sb.from("health_articles").select("*").eq("slug", slug);
  if (publishedOnly) q = q.eq("is_published", true);
  const { data, error } = await q.maybeSingle();
  if (error) {
    if (isMissingTableError(error)) return null;
    throw error;
  }
  return data ? mapArticle(data as Record<string, unknown>) : null;
}

export async function sbGetArticleById(id: string): Promise<HealthArticle | null> {
  const sb = adminClient();
  const { data, error } = await sb
    .from("health_articles")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) {
    if (isMissingTableError(error)) return null;
    throw error;
  }
  return data ? mapArticle(data as Record<string, unknown>) : null;
}

export async function sbUpsertArticle(article: HealthArticle): Promise<HealthArticle> {
  const sb = adminClient();
  const { data, error } = await sb
    .from("health_articles")
    .upsert(article)
    .select("*")
    .single();
  if (error) throw error;
  return mapArticle(data as Record<string, unknown>);
}

export async function sbDeleteArticle(id: string): Promise<void> {
  const sb = adminClient();
  const { error } = await sb.from("health_articles").delete().eq("id", id);
  if (error) throw error;
}

/** Seed demo catalog if empty (idempotent). */
export async function sbEnsureSeed(): Promise<void> {
  const sb = adminClient();
  const { count } = await sb
    .from("products")
    .select("*", { count: "exact", head: true });
  if ((count ?? 0) > 0) return;

  const { data: settings } = await sb.from("site_settings").select("id").limit(1);
  if (!settings?.length) {
    const { id: _id, ...rest } = defaultSettings;
    await sb.from("site_settings").insert(rest);
  }

  await sb.from("categories").upsert(
    seedCategories.map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      description: c.description,
      sort: c.sort,
      image_url: c.image_url,
    })),
  );

  await sb.from("products").upsert(
    seedProducts.map((p) => ({
      ...p,
      // keep string ids from seed for demo stability
    })),
  );

  const { count: articleCount } = await sb
    .from("health_articles")
    .select("*", { count: "exact", head: true });
  if ((articleCount ?? 0) === 0) {
    const { error: seedErr } = await sb.from("health_articles").upsert(seedArticles);
    if (seedErr) {
      console.warn("[seed] health_articles skipped:", seedErr.message);
    }
  }
}
