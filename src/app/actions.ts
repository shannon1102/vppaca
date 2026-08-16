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
import {
  clearLoginAttempts,
  getClientIp,
  isLoginRateLimited,
  recordFailedLogin,
} from "@/lib/auth/login-rate-limit";
import { buildCategoryFromInput } from "@/lib/categories/build-category";
import { repo } from "@/lib/data/repository";
import { CACHE_TAGS } from "@/lib/data/cached-repo";
import { ensureUniqueSku, ensureUniqueSlug, orderCode } from "@/lib/format";
import { BRAND_COLORS } from "@/lib/brand-colors";
import { normalizeImageSrc } from "@/lib/media/helpers";
import { deleteArticleMedia } from "@/lib/media/delete-media";
import { parseSpecsFromForm } from "@/lib/product-specs";
import { persistRichHtmlImages } from "@/lib/media/process-html-images";
import {
  FORM_LIMITS,
  clampText,
  stripDataImages,
} from "@/lib/form-limits";
import type { HealthArticle, Order, OrderStatus, Product } from "@/lib/types";

async function sanitizeRichHtml(raw: string): Promise<string> {
  const stripped = stripDataImages(raw);
  const persisted = await persistRichHtmlImages(stripped);
  return clampText(stripDataImages(persisted), FORM_LIMITS.richHtml);
}

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
  const ip = await getClientIp();
  const rate = await isLoginRateLimited(ip);
  if (rate.limited) {
    redirect(`/admin/login?error=locked&retry=${rate.retryAfterSec ?? 900}`);
  }

  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  if (!verifyAdminCredentials(email, password)) {
    await recordFailedLogin(ip);
    redirect("/admin/login?error=1");
  }
  await clearLoginAttempts(ip);
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
    shop_name: clampText(String(formData.get("shop_name") ?? ""), FORM_LIMITS.shopName),
    tagline: clampText(String(formData.get("tagline") ?? ""), FORM_LIMITS.tagline),
    phone: clampText(String(formData.get("phone") ?? ""), FORM_LIMITS.phone),
    email: clampText(String(formData.get("email") ?? ""), FORM_LIMITS.email),
    address: clampText(String(formData.get("address") ?? ""), FORM_LIMITS.address),
    logo_url: clampText(String(formData.get("logo_url") ?? ""), FORM_LIMITS.url),
    favicon_url: clampText(String(formData.get("favicon_url") ?? ""), FORM_LIMITS.url),
    primary_color: clampText(
      String(formData.get("primary_color") ?? BRAND_COLORS.primary),
      FORM_LIMITS.color,
    ),
    secondary_color: clampText(
      String(formData.get("secondary_color") ?? BRAND_COLORS.secondary),
      FORM_LIMITS.color,
    ),
    accent_color: clampText(
      String(formData.get("accent_color") ?? BRAND_COLORS.accent),
      FORM_LIMITS.color,
    ),
    bank_name: clampText(String(formData.get("bank_name") ?? ""), FORM_LIMITS.bankName),
    bank_account: clampText(
      String(formData.get("bank_account") ?? ""),
      FORM_LIMITS.bankAccount,
    ),
    bank_holder: clampText(
      String(formData.get("bank_holder") ?? ""),
      FORM_LIMITS.bankHolder,
    ),
    transfer_content_template: clampText(
      String(formData.get("transfer_content_template") ?? "DH {code}"),
      FORM_LIMITS.transferTemplate,
    ),
    qr_image_url: clampText(String(formData.get("qr_image_url") ?? ""), FORM_LIMITS.url),
    facebook_url: clampText(String(formData.get("facebook_url") ?? ""), FORM_LIMITS.url),
    zalo_url: clampText(String(formData.get("zalo_url") ?? ""), FORM_LIMITS.url),
  });
  revalidatePath("/");
  revalidatePath("/admin/branding");
  revalidateTag(CACHE_TAGS.settings, "max");
  redirect("/admin/branding?toast=settings-saved");
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
  const specs: Record<string, string> = parseSpecsFromForm(formData);
  const sale = String(formData.get("sale_price") ?? "");
  const name = clampText(String(formData.get("name") ?? ""), FORM_LIMITS.name);
  const description = clampText(
    String(formData.get("description") ?? ""),
    FORM_LIMITS.description,
  );
  let detailDescription = String(formData.get("detail_description") ?? "");
  // Overlap image persist with catalog fetch to shorten submit wait
  const existingPromise = repo.listProducts();
  try {
    detailDescription = await sanitizeRichHtml(detailDescription);
  } catch (e) {
    console.error("[product] persistRichHtmlImages failed", e);
    redirect(`${backPath}?error=save`);
  }
  const existing = await existingPromise;
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
    sold_count: existingProduct?.sold_count ?? 10,
    is_published: formData.get("is_published") === "on",
    is_featured: formData.get("is_featured") === "on",
    seo_title: clampText(String(formData.get("seo_title") ?? ""), FORM_LIMITS.seoTitle),
    seo_description: clampText(
      String(formData.get("seo_description") ?? ""),
      FORM_LIMITS.seoDescription,
    ),
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
  redirect("/admin/products?toast=product-saved");
}

export async function deleteProductAction(formData: FormData) {
  await requireAdmin();
  await repo.deleteProduct(String(formData.get("id")));
  revalidatePath("/admin/products");
  revalidatePath("/san-pham");
  revalidateTag(CACHE_TAGS.products, "max");
  redirect("/admin/products?toast=product-deleted");
}

export async function saveCategoryAction(formData: FormData) {
  await requireAdmin();
  const catName = clampText(String(formData.get("name") ?? ""), FORM_LIMITS.name);
  const catId = clampText(
    String(formData.get("id") || `cat-${Date.now()}`),
    FORM_LIMITS.categoryId,
  );
  const categories = await repo.listCategories();
  const imageRaw = clampText(String(formData.get("image_url") ?? ""), FORM_LIMITS.url);
  const cat = buildCategoryFromInput(
    {
      id: catId,
      name: catName,
      description: clampText(
        String(formData.get("description") ?? ""),
        FORM_LIMITS.categoryDescription,
      ),
      sort: Number(formData.get("sort") ?? 0),
      image_url: imageRaw || null,
    },
    categories,
  );
  await repo.upsertCategory(cat);
  revalidatePath("/");
  revalidatePath("/admin/categories");
  revalidateTag(CACHE_TAGS.categories, "max");
  redirect("/admin/categories?toast=category-saved");
}

export async function deleteCategoryAction(formData: FormData) {
  await requireAdmin();
  await repo.deleteCategory(String(formData.get("id")));
  revalidatePath("/admin/categories");
  revalidateTag(CACHE_TAGS.categories, "max");
  redirect("/admin/categories?toast=category-deleted");
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
  const tagsRaw = clampText(String(formData.get("tags") ?? ""), FORM_LIMITS.tags);
  const tags = tagsRaw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 5);
  const now = new Date().toISOString();
  const title = clampText(String(formData.get("title") ?? ""), FORM_LIMITS.title);
  const coverRaw = clampText(
    String(formData.get("cover_image_url") ?? "").trim(),
    FORM_LIMITS.url,
  );
  const articlesPromise = repo.listArticles();
  const content = await sanitizeRichHtml(String(formData.get("content") ?? ""));
  const articles = await articlesPromise;
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
    excerpt: clampText(String(formData.get("excerpt") ?? ""), FORM_LIMITS.excerpt),
    content,
    cover_image_url: coverRaw ? normalizeImageSrc(coverRaw) : null,
    tags,
    is_published: formData.get("is_published") === "on",
    seo_title: clampText(String(formData.get("seo_title") ?? ""), FORM_LIMITS.seoTitle),
    seo_description: clampText(
      String(formData.get("seo_description") ?? ""),
      FORM_LIMITS.seoDescription,
    ),
    created_at: String(formData.get("created_at") || now),
    updated_at: now,
  };
  await repo.upsertArticle(article);
  revalidatePath("/bai-viet-suc-khoe");
  revalidatePath("/admin/articles");
  revalidateTag(CACHE_TAGS.articles, "max");
  redirect("/admin/articles?toast=article-saved");
}

export async function deleteArticleAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  const article = await repo.getArticleById(id);
  if (article) {
    await deleteArticleMedia(article);
  }
  await repo.deleteArticle(id);
  revalidatePath("/bai-viet-suc-khoe");
  revalidatePath("/admin/articles");
  revalidateTag(CACHE_TAGS.articles, "max");
  redirect("/admin/articles?toast=article-deleted");
}
