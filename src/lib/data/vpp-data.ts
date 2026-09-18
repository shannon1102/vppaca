import { createClient } from "@supabase/supabase-js";
import { promises as fs } from "fs";
import path from "path";
import {
  seedBanners,
  seedProducts,
  seedPromotionProducts,
  seedPromotions,
  seedTiers,
  seedUoms,
} from "@/data/seed";
import type {
  Banner,
  Order,
  Product,
  ProductCatalog,
  ProductPriceTier,
  ProductUom,
  Promotion,
  PromotionProduct,
  RfqRequest,
  StockAlert,
} from "@/lib/types";
import { isSupabaseConfigured } from "@/lib/data/config";

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

const DATA_DIR = path.join(process.cwd(), ".data");
const VPP_FILE = path.join(DATA_DIR, "vpp.json");

type VppLocal = {
  uoms: ProductUom[];
  tiers: ProductPriceTier[];
  banners: Banner[];
  promotions: Promotion[];
  promotionProducts: PromotionProduct[];
  rfqs: RfqRequest[];
  stockAlerts: StockAlert[];
};

async function readVppLocal(): Promise<VppLocal> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    const raw = await fs.readFile(VPP_FILE, "utf8");
    return JSON.parse(raw) as VppLocal;
  } catch {
    const initial: VppLocal = {
      uoms: seedUoms,
      tiers: seedTiers,
      banners: seedBanners,
      promotions: seedPromotions,
      promotionProducts: seedPromotionProducts,
      rfqs: [],
      stockAlerts: [],
    };
    await fs.writeFile(VPP_FILE, JSON.stringify(initial, null, 2), "utf8");
    return initial;
  }
}

async function writeVppLocal(data: VppLocal) {
  await fs.writeFile(VPP_FILE, JSON.stringify(data, null, 2), "utf8");
}

function isActiveBanner(b: Banner, at = new Date()) {
  if (!b.is_active) return false;
  if (b.starts_at && new Date(b.starts_at) > at) return false;
  if (b.ends_at && new Date(b.ends_at) < at) return false;
  return true;
}

function isActivePromotion(p: Promotion, at = new Date()) {
  if (!p.is_active) return false;
  return new Date(p.starts_at) <= at && new Date(p.ends_at) >= at;
}

export async function vppListBanners(placement?: string): Promise<Banner[]> {
  if (isSupabaseConfigured()) {
    const sb = adminClient();
    let q = sb.from("banners").select("*").eq("is_active", true);
    if (placement) q = q.eq("placement", placement);
    const { data, error } = await q.order("sort");
    if (error) throw error;
    return (data ?? [])
      .map(mapBanner)
      .filter((b) => isActiveBanner(b));
  }
  const local = await readVppLocal();
  return local.banners
    .filter((b) => !placement || b.placement === placement)
    .filter((b) => isActiveBanner(b))
    .sort((a, b) => a.sort - b.sort);
}

export async function vppGetActiveFlashSale(): Promise<{
  promotion: Promotion | null;
  products: PromotionProduct[];
}> {
  const at = new Date();
  if (isSupabaseConfigured()) {
    const sb = adminClient();
    const { data: promos, error } = await sb
      .from("promotions")
      .select("*")
      .eq("is_active", true)
      .eq("type", "flash_sale");
    if (error) throw error;
    const promotion =
      (promos ?? []).map(mapPromotion).find((p) => isActivePromotion(p, at)) ??
      null;
    if (!promotion) return { promotion: null, products: [] };
    const { data: pp, error: e2 } = await sb
      .from("promotion_products")
      .select("*")
      .eq("promotion_id", promotion.id);
    if (e2) throw e2;
    return {
      promotion,
      products: (pp ?? []).map(mapPromotionProduct),
    };
  }
  const local = await readVppLocal();
  const promotion =
    local.promotions.find((p) => p.type === "flash_sale" && isActivePromotion(p, at)) ??
    null;
  if (!promotion) return { promotion: null, products: [] };
  return {
    promotion,
    products: local.promotionProducts.filter((p) => p.promotion_id === promotion.id),
  };
}

export async function vppGetProductUoms(productId: string): Promise<ProductUom[]> {
  if (isSupabaseConfigured()) {
    const sb = adminClient();
    const { data, error } = await sb
      .from("product_uoms")
      .select("*")
      .eq("product_id", productId)
      .order("sort");
    if (error) throw error;
    return (data ?? []).map(mapUom);
  }
  const local = await readVppLocal();
  return local.uoms.filter((u) => u.product_id === productId).sort((a, b) => a.sort - b.sort);
}

export async function vppGetProductTiers(productId: string): Promise<ProductPriceTier[]> {
  if (isSupabaseConfigured()) {
    const sb = adminClient();
    const { data, error } = await sb
      .from("product_price_tiers")
      .select("*")
      .eq("product_id", productId);
    if (error) throw error;
    return (data ?? []).map(mapTier);
  }
  const local = await readVppLocal();
  return local.tiers.filter((t) => t.product_id === productId);
}

export async function vppGetProductCatalog(product: Product): Promise<ProductCatalog> {
  const [uoms, tiers] = await Promise.all([
    vppGetProductUoms(product.id),
    vppGetProductTiers(product.id),
  ]);
  return { ...product, uoms, tiers };
}

export async function vppSaveProductUomsTiers(
  productId: string,
  uoms: ProductUom[],
  tiers: ProductPriceTier[],
): Promise<void> {
  if (isSupabaseConfigured()) {
    const sb = adminClient();
    await sb.from("product_uoms").delete().eq("product_id", productId);
    await sb.from("product_price_tiers").delete().eq("product_id", productId);
    if (uoms.length) {
      const { error } = await sb.from("product_uoms").insert(uoms);
      if (error) throw error;
    }
    if (tiers.length) {
      const { error } = await sb.from("product_price_tiers").insert(tiers);
      if (error) throw error;
    }
    return;
  }
  const local = await readVppLocal();
  local.uoms = local.uoms.filter((u) => u.product_id !== productId).concat(uoms);
  local.tiers = local.tiers.filter((t) => t.product_id !== productId).concat(tiers);
  await writeVppLocal(local);
}

export async function vppDeductStock(
  lines: { productId: string; qtyBase: number }[],
): Promise<{ ok: boolean; error?: string }> {
  if (isSupabaseConfigured()) {
    const sb = adminClient();
    for (const line of lines) {
      const { data, error: sel } = await sb
        .from("products")
        .select("stock, min_stock, name")
        .eq("id", line.productId)
        .maybeSingle();
      if (sel) throw sel;
      if (!data) return { ok: false, error: "Sản phẩm không tồn tại." };
      const stock = Number(data.stock);
      if (stock < line.qtyBase) {
        return { ok: false, error: `Không đủ tồn kho: ${data.name}.` };
      }
      const newStock = stock - line.qtyBase;
      const { error } = await sb
        .from("products")
        .update({ stock: newStock })
        .eq("id", line.productId)
        .gte("stock", line.qtyBase);
      if (error) throw error;
      const minStock = Number(data.min_stock ?? 0);
      if (minStock > 0 && newStock <= minStock) {
        await sb.from("stock_alerts").insert({
          product_id: line.productId,
          stock_at_alert: newStock,
          min_stock: minStock,
        });
      }
    }
    return { ok: true };
  }
  const { localGetProductById, localUpsertProduct } = await import(
    "@/lib/data/local-store"
  );
  for (const line of lines) {
    const p = await localGetProductById(line.productId);
    if (!p) return { ok: false, error: "Sản phẩm không tồn tại." };
    if (p.stock < line.qtyBase) {
      return { ok: false, error: `Không đủ tồn kho: ${p.name}.` };
    }
    p.stock -= line.qtyBase;
    await localUpsertProduct(p);
  }
  return { ok: true };
}

export async function vppListLowStock(): Promise<
  { product: Product; stock: number; min_stock: number }[]
> {
  const { repo } = await import("@/lib/data/repository");
  const products = await repo.listProducts();
  return products
    .filter((p) => p.min_stock > 0 && p.stock <= p.min_stock)
    .map((p) => ({ product: p, stock: p.stock, min_stock: p.min_stock }));
}

export async function vppCreateRfq(rfq: RfqRequest): Promise<RfqRequest> {
  if (isSupabaseConfigured()) {
    const sb = adminClient();
    const { items, ...header } = rfq;
    const { error: e1 } = await sb.from("rfq_requests").insert({
      id: header.id,
      company_name: header.company_name,
      contact_name: header.contact_name,
      contact_phone: header.contact_phone,
      contact_email: header.contact_email,
      note: header.note,
      status: header.status,
      source: header.source,
      excel_path: header.excel_path,
      created_at: header.created_at,
    });
    if (e1) throw e1;
    if (items?.length) {
      const { error: e2 } = await sb.from("rfq_items").insert(items);
      if (e2) throw e2;
    }
    return rfq;
  }
  const local = await readVppLocal();
  local.rfqs.unshift(rfq);
  await writeVppLocal(local);
  return rfq;
}

export async function vppListRfqs(): Promise<RfqRequest[]> {
  if (isSupabaseConfigured()) {
    const sb = adminClient();
    const { data, error } = await sb
      .from("rfq_requests")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data ?? []).map(mapRfq);
  }
  const local = await readVppLocal();
  return local.rfqs;
}

/** Đồng bộ banner trang chủ (carousel + strip) từ seed — idempotent. */
export async function vppSyncHomeBanners(): Promise<void> {
  if (!isSupabaseConfigured()) return;
  const sb = adminClient();
  const { error } = await sb.from("banners").upsert(seedBanners, { onConflict: "id" });
  if (error) throw error;
  await sb
    .from("banners")
    .update({ is_active: false })
    .in("id", ["ban-1", "ban-2", "ban-3"]);
}

export async function vppSeedCatalogIfEmpty(): Promise<void> {
  if (!isSupabaseConfigured()) return;
  const sb = adminClient();
  const { count, error } = await sb
    .from("products")
    .select("*", { count: "exact", head: true });
  if (error) throw error;
  if ((count ?? 0) > 0) return;

  const { seedCategories } = await import("@/data/seed");
  await sb.from("categories").upsert(seedCategories, { onConflict: "id" });
  await sb.from("products").insert(seedProducts);
  await sb.from("product_uoms").insert(seedUoms);
  await sb.from("product_price_tiers").insert(seedTiers);
  await sb.from("banners").insert(seedBanners);
  await sb.from("promotions").insert(seedPromotions);
  await sb.from("promotion_products").insert(seedPromotionProducts);
}

function mapBanner(row: Record<string, unknown>): Banner {
  return {
    id: String(row.id),
    title: String(row.title ?? ""),
    image_url: String(row.image_url),
    link_url: String(row.link_url ?? "/"),
    sort: Number(row.sort ?? 0),
    starts_at: row.starts_at ? String(row.starts_at) : null,
    ends_at: row.ends_at ? String(row.ends_at) : null,
    is_active: Boolean(row.is_active),
    placement: String(row.placement ?? "home_carousel"),
  };
}

function mapPromotion(row: Record<string, unknown>): Promotion {
  return {
    id: String(row.id),
    name: String(row.name),
    slug: String(row.slug),
    type: row.type as Promotion["type"],
    discount_type: row.discount_type as Promotion["discount_type"],
    discount_value: Number(row.discount_value),
    starts_at: String(row.starts_at),
    ends_at: String(row.ends_at),
    is_active: Boolean(row.is_active),
  };
}

function mapPromotionProduct(row: Record<string, unknown>): PromotionProduct {
  return {
    id: String(row.id),
    promotion_id: String(row.promotion_id),
    product_id: String(row.product_id),
    sale_price: row.sale_price == null ? null : Number(row.sale_price),
  };
}

function mapUom(row: Record<string, unknown>): ProductUom {
  return {
    id: String(row.id),
    product_id: String(row.product_id),
    code: String(row.code),
    label_vi: String(row.label_vi),
    factor_to_base: Number(row.factor_to_base),
    is_default_b2c: Boolean(row.is_default_b2c),
    is_default_b2b: Boolean(row.is_default_b2b),
    barcode: String(row.barcode ?? ""),
    sort: Number(row.sort ?? 0),
  };
}

function mapTier(row: Record<string, unknown>): ProductPriceTier {
  return {
    id: String(row.id),
    product_id: String(row.product_id),
    uom_code: String(row.uom_code),
    min_qty: Number(row.min_qty),
    max_qty: row.max_qty == null ? null : Number(row.max_qty),
    unit_price: Number(row.unit_price),
  };
}

function mapRfq(row: Record<string, unknown>): RfqRequest {
  return {
    id: String(row.id),
    company_name: String(row.company_name ?? ""),
    contact_name: String(row.contact_name),
    contact_phone: String(row.contact_phone),
    contact_email: String(row.contact_email ?? ""),
    note: String(row.note ?? ""),
    status: row.status as RfqRequest["status"],
    source: row.source as RfqRequest["source"],
    excel_path: String(row.excel_path ?? ""),
    created_at: String(row.created_at),
  };
}

export async function vppFindProductBySku(sku: string): Promise<Product | null> {
  const { repo } = await import("@/lib/data/repository");
  const list = await repo.listProducts();
  const normalized = sku.trim().toUpperCase();
  return list.find((p) => p.sku.toUpperCase() === normalized) ?? null;
}

export type ValidatedOrderLine = {
  productId: string;
  name: string;
  qty: number;
  unit_price: number;
  uom_code: string;
  factor_to_base: number;
  qty_base: number;
  tier_label: string;
};

export async function vppValidateCartLines(
  lines: { productId: string; uomCode: string; qty: number }[],
): Promise<{ ok: true; items: ValidatedOrderLine[]; subtotal: number } | { ok: false; error: string }> {
  const { repo } = await import("@/lib/data/repository");
  const { resolveUnitPrice } = await import("@/lib/pricing");
  const flash = await vppGetActiveFlashSale();
  const items: ValidatedOrderLine[] = [];

  for (const line of lines) {
    const product = await repo.getProductById(line.productId);
    if (!product || !product.is_published) {
      return { ok: false, error: "Sản phẩm không hợp lệ." };
    }
    const catalog = await vppGetProductCatalog(product);
    const resolved = resolveUnitPrice({
      product,
      uoms: catalog.uoms,
      tiers: catalog.tiers,
      uomCode: line.uomCode,
      qty: line.qty,
      promoProducts: flash.products,
    });
    if (!resolved) return { ok: false, error: `Đơn vị không hợp lệ: ${product.name}.` };
    items.push({
      productId: product.id,
      name: `${product.name} (${line.uomCode})`,
      qty: line.qty,
      unit_price: resolved.unitPrice,
      uom_code: line.uomCode,
      factor_to_base: resolved.factorToBase,
      qty_base: resolved.qtyBase,
      tier_label: resolved.tierLabel,
    });
  }
  const subtotal = items.reduce((s, i) => s + i.unit_price * i.qty, 0);
  return { ok: true, items, subtotal };
}

export async function vppUpsertBanner(banner: Banner): Promise<Banner> {
  if (isSupabaseConfigured()) {
    const sb = adminClient();
    const { data, error } = await sb.from("banners").upsert(banner).select("*").single();
    if (error) throw error;
    return mapBanner(data as Record<string, unknown>);
  }
  const local = await readVppLocal();
  const i = local.banners.findIndex((b) => b.id === banner.id);
  if (i >= 0) local.banners[i] = banner;
  else local.banners.push(banner);
  await writeVppLocal(local);
  return banner;
}

export async function vppListAllBanners(): Promise<Banner[]> {
  if (isSupabaseConfigured()) {
    const sb = adminClient();
    const { data, error } = await sb.from("banners").select("*").order("sort");
    if (error) throw error;
    return (data ?? []).map(mapBanner);
  }
  const local = await readVppLocal();
  return local.banners.sort((a, b) => a.sort - b.sort);
}
