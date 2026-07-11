"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import {
  clearAdminSession,
  setAdminSession,
  verifyAdminCredentials,
  isAdminAuthenticated,
} from "@/lib/auth-admin";
import { repo } from "@/lib/data/repository";
import { CACHE_TAGS } from "@/lib/data/cached-repo";
import { ensureUniqueSku, ensureUniqueSlug, orderCode } from "@/lib/format";
import { BRAND_COLORS } from "@/lib/brand-colors";
import { normalizeImageSrc } from "@/lib/media/helpers";
import { parseSpecsFromForm } from "@/lib/product-specs";
import { persistRichHtmlImages } from "@/lib/media/process-html-images";
import type { Category, HealthArticle, Order, OrderStatus, Product } from "@/lib/types";

const checkoutSchema = z.object({
  customer_name: z.string().min(2),
  customer_phone: z.string().min(8),
  customer_email: z.string().optional().or(z.literal("")),
  customer_address: z.string().min(5),
  note: z.string().optional(),
  items_json: z.string().min(2),
});

export async function placeOrderAction(formData: FormData) {
  const parsed = checkoutSchema.safeParse({
    customer_name: formData.get("customer_name"),
    customer_phone: formData.get("customer_phone"),
    customer_email: formData.get("customer_email") ?? "",
    customer_address: formData.get("customer_address"),
    note: formData.get("note") ?? "",
    items_json: formData.get("items_json"),
  });
  if (!parsed.success) {
    return { error: "Vui lòng điền đầy đủ thông tin hợp lệ." };
  }

  type Line = { productId: string; name: string; qty: number; unit_price: number };
  let lines: Line[] = [];
  try {
    lines = JSON.parse(parsed.data.items_json) as Line[];
  } catch {
    return { error: "Giỏ hàng không hợp lệ." };
  }
  if (!lines.length) return { error: "Giỏ hàng trống." };

  const code = orderCode();
  const total = lines.reduce((s, l) => s + l.unit_price * l.qty, 0);
  const id = `ord-${Date.now()}`;
  const order: Order = {
    id,
    code,
    customer_name: parsed.data.customer_name,
    customer_phone: parsed.data.customer_phone,
    customer_email: parsed.data.customer_email || "",
    customer_address: parsed.data.customer_address,
    note: parsed.data.note || "",
    status: "pending",
    total,
    created_at: new Date().toISOString(),
    items: lines.map((l, idx) => ({
      id: `${id}-${idx}`,
      order_id: id,
      product_id: l.productId,
      name: l.name,
      qty: l.qty,
      unit_price: l.unit_price,
    })),
  };
  await repo.createOrder(order);

  revalidateTag(CACHE_TAGS.products, "max");

  // Notify admin by email (non-blocking for checkout success)
  try {
    const settings = await repo.getSettings();
    const { notifyAdminNewOrder } = await import("@/lib/email/send");
    const result = await notifyAdminNewOrder({ order, settings });
    if (!result.sent) {
      console.error("[email] notify not sent", {
        code: order.code,
        provider: result.provider,
        reason: result.reason,
      });
    }
  } catch (e) {
    console.error("[email] notify failed", e);
  }

  return { code };
}

export async function adminLoginAction(formData: FormData) {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  if (!verifyAdminCredentials(email, password)) {
    redirect("/admin/login?error=1");
  }
  await setAdminSession();
  redirect("/admin");
}

export async function adminLogoutAction() {
  await clearAdminSession();
  redirect("/admin/login");
}

async function requireAdmin() {
  if (!(await isAdminAuthenticated())) redirect("/admin/login");
}

export async function saveSettingsAction(formData: FormData) {
  await requireAdmin();
  await repo.updateSettings({
    shop_name: String(formData.get("shop_name") ?? ""),
    tagline: String(formData.get("tagline") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    email: String(formData.get("email") ?? ""),
    address: String(formData.get("address") ?? ""),
    logo_url: String(formData.get("logo_url") ?? ""),
    favicon_url: String(formData.get("favicon_url") ?? ""),
    primary_color: String(formData.get("primary_color") ?? BRAND_COLORS.primary),
    secondary_color: String(formData.get("secondary_color") ?? BRAND_COLORS.secondary),
    accent_color: String(formData.get("accent_color") ?? BRAND_COLORS.accent),
    bank_name: String(formData.get("bank_name") ?? ""),
    bank_account: String(formData.get("bank_account") ?? ""),
    bank_holder: String(formData.get("bank_holder") ?? ""),
    transfer_content_template: String(
      formData.get("transfer_content_template") ?? "DH {code}",
    ),
    qr_image_url: String(formData.get("qr_image_url") ?? ""),
    facebook_url: String(formData.get("facebook_url") ?? ""),
    zalo_url: String(formData.get("zalo_url") ?? ""),
  });
  revalidatePath("/");
  revalidatePath("/admin/branding");
  revalidateTag(CACHE_TAGS.settings, "max");
  redirect("/admin/branding?saved=1");
}

export async function saveProductAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") || `p-${Date.now()}`);
  const isNew = !formData.get("id");
  const backPath = isNew ? "/admin/products/new" : `/admin/products/${id}`;
  const existingProduct = isNew ? null : await repo.getProductById(id);
  const imagesRaw = String(formData.get("images") ?? "");
  const images = imagesRaw
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
  let specs: Record<string, string> = parseSpecsFromForm(formData);
  const sale = String(formData.get("sale_price") ?? "");
  const name = String(formData.get("name") ?? "");
  const description = String(formData.get("description") ?? "");
  let detailDescription = String(formData.get("detail_description") ?? "");
  try {
    detailDescription = await persistRichHtmlImages(detailDescription);
  } catch (e) {
    console.error("[product] persistRichHtmlImages failed", e);
    redirect(`${backPath}?error=save`);
  }
  const existing = await repo.listProducts();
  const slug = ensureUniqueSlug({
    title: name,
    id,
    current: existingProduct?.slug,
    taken: existing.filter((p) => p.id !== id).map((p) => p.slug),
  });
  const sku = ensureUniqueSku({
    name,
    id,
    current: existingProduct?.sku,
    taken: existing.filter((p) => p.id !== id).map((p) => p.sku),
  });

  const product: Product = {
    id,
    name,
    slug,
    sku,
    price: Number(formData.get("price") ?? 0),
    sale_price: sale ? Number(sale) : null,
    description,
    detail_description: detailDescription,
    specs,
    category_id: String(formData.get("category_id") ?? ""),
    images: images.length ? images : ["/seed/product-01.svg"],
    stock: Number(formData.get("stock") ?? 0),
    sold_count: existingProduct?.sold_count ?? 0,
    is_published: formData.get("is_published") === "on",
    is_featured: formData.get("is_featured") === "on",
    seo_title: String(formData.get("seo_title") ?? ""),
    seo_description: String(formData.get("seo_description") ?? ""),
  };

  try {
    await repo.upsertProduct(product);
  } catch (e) {
    console.error("[product] upsert failed", e);
    redirect(`${backPath}?error=save`);
  }
  revalidatePath("/san-pham");
  revalidatePath(`/san-pham/${product.slug}`);
  revalidatePath("/admin/products");
  revalidateTag(CACHE_TAGS.products, "max");
  redirect("/admin/products");
}

export async function deleteProductAction(formData: FormData) {
  await requireAdmin();
  await repo.deleteProduct(String(formData.get("id")));
  revalidatePath("/admin/products");
  revalidatePath("/san-pham");
  revalidateTag(CACHE_TAGS.products, "max");
}

export async function saveCategoryAction(formData: FormData) {
  await requireAdmin();
  const catName = String(formData.get("name") ?? "");
  const catId = String(formData.get("id") || `cat-${Date.now()}`);
  const categories = await repo.listCategories();
  const existingCat = categories.find((c) => c.id === catId);
  const cat: Category = {
    id: catId,
    name: catName,
    slug: ensureUniqueSlug({
      title: catName,
      id: catId,
      current: existingCat?.slug,
      taken: categories.filter((c) => c.id !== catId).map((c) => c.slug),
    }),
    description: String(formData.get("description") ?? ""),
    sort: Number(formData.get("sort") ?? 0),
    image_url: String(formData.get("image_url") ?? "") || null,
  };
  await repo.upsertCategory(cat);
  revalidatePath("/");
  revalidatePath("/admin/categories");
  revalidateTag(CACHE_TAGS.categories, "max");
  redirect("/admin/categories");
}

export async function deleteCategoryAction(formData: FormData) {
  await requireAdmin();
  await repo.deleteCategory(String(formData.get("id")));
  revalidatePath("/admin/categories");
  revalidateTag(CACHE_TAGS.categories, "max");
}

export async function updateOrderStatusAction(
  formData: FormData,
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    await requireAdmin();
    const id = String(formData.get("id"));
    const status = String(formData.get("status")) as OrderStatus;
    const updated = await repo.updateOrderStatus(id, status);
    if (!updated) {
      return { ok: false, error: "Không tìm thấy đơn hàng" };
    }
    revalidatePath("/admin/orders");
    return { ok: true };
  } catch (e) {
    console.error("[order] update status failed", e);
    return { ok: false, error: "Cập nhật đơn hàng thất bại" };
  }
}

export async function saveArticleAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") || `art-${Date.now()}`);
  const tagsRaw = String(formData.get("tags") ?? "");
  const tags = tagsRaw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 5);
  const now = new Date().toISOString();
  const title = String(formData.get("title") ?? "");
  const coverRaw = String(formData.get("cover_image_url") ?? "").trim();
  const content = await persistRichHtmlImages(String(formData.get("content") ?? ""));
  const articles = await repo.listArticles();
  const existingArticle = articles.find((a) => a.id === id);
  const article: HealthArticle = {
    id,
    title,
    slug: ensureUniqueSlug({
      title,
      id,
      current: existingArticle?.slug,
      taken: articles.filter((a) => a.id !== id).map((a) => a.slug),
    }),
    excerpt: String(formData.get("excerpt") ?? ""),
    content,
    cover_image_url: coverRaw ? normalizeImageSrc(coverRaw) : null,
    tags,
    is_published: formData.get("is_published") === "on",
    seo_title: String(formData.get("seo_title") ?? ""),
    seo_description: String(formData.get("seo_description") ?? ""),
    created_at: String(formData.get("created_at") || now),
    updated_at: now,
  };
  await repo.upsertArticle(article);
  revalidatePath("/bai-viet-suc-khoe");
  revalidatePath("/admin/articles");
  revalidateTag(CACHE_TAGS.articles, "max");
  redirect("/admin/articles");
}

export async function deleteArticleAction(formData: FormData) {
  await requireAdmin();
  await repo.deleteArticle(String(formData.get("id")));
  revalidatePath("/bai-viet-suc-khoe");
  revalidatePath("/admin/articles");
  revalidateTag(CACHE_TAGS.articles, "max");
}
