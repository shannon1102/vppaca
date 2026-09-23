import { unstable_cache } from "next/cache";
import { cache as reactCache } from "react";
import {
  localGetArticleBySlug,
  localGetProductBySlug,
  localGetSettings,
  localListArticles,
  localListCategories,
  localListProducts,
  localListRelatedProducts,
} from "@/lib/data/local-store";
import {
  sbGetArticleBySlug,
  sbGetProductBySlug,
  sbGetSettings,
  sbListArticles,
  sbListCategories,
  sbListProducts,
  sbListRelatedProducts,
} from "@/lib/data/supabase-store";
import type { Category, HealthArticle, Product, SiteSettings } from "@/lib/types";

function isSupabaseConfigured(): boolean {
  const url =
    process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_SECRET_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.SUPABASE_ANON_KEY;
  return Boolean(url && key && process.env.USE_SUPABASE !== "false");
}

export const CACHE_TAGS = {
  settings: "settings",
  categories: "categories",
  products: "products",
  articles: "articles",
} as const;

async function withSeed<T>(fn: () => Promise<T>): Promise<T> {
  try {
    const { sbEnsureSeed } = await import("@/lib/data/supabase-store");
    const g = globalThis as { __seed?: Promise<void> };
    if (!g.__seed) {
      g.__seed = sbEnsureSeed().catch((error) => {
        g.__seed = undefined;
        console.error("[seed]", error);
      });
    }
    await g.__seed;
  } catch (error) {
    console.error("[seed]", error);
  }
  return fn();
}

async function supabaseOrLocal<T>(
  remote: () => Promise<T>,
  local: () => Promise<T>,
): Promise<T> {
  if (!isSupabaseConfigured()) return local();
  try {
    return await withSeed(remote);
  } catch (error) {
    console.error("[cached-repo] supabase read failed, using local catalog", error);
    return local();
  }
}

function cached<T>(
  keyParts: string[],
  fn: () => Promise<T>,
  revalidate: number,
  tags: string[],
): Promise<T> {
  return unstable_cache(fn, keyParts, { revalidate, tags })();
}

export const cachedRepo = {
  getSettings: reactCache(() =>
    cached(["repo-settings"], () =>
      supabaseOrLocal(() => sbGetSettings(), localGetSettings),
    300, [CACHE_TAGS.settings]),
  ),
  listCategories: reactCache(() =>
    cached(["repo-categories"], () =>
      supabaseOrLocal(() => sbListCategories(), localListCategories),
    300, [CACHE_TAGS.categories]),
  ),
  listProducts: reactCache((opts?: { publishedOnly?: boolean; categorySlug?: string }) => {
    const key = JSON.stringify(opts ?? {});
    return cached(["repo-products", key], () =>
      supabaseOrLocal(() => sbListProducts(opts), () => localListProducts(opts)),
    60, [CACHE_TAGS.products]);
  }),
  getProductBySlug: reactCache((slug: string, publishedOnly = true) =>
    cached(["repo-product-slug", slug, String(publishedOnly)], () =>
      supabaseOrLocal(
        () => sbGetProductBySlug(slug, publishedOnly),
        () => localGetProductBySlug(slug, publishedOnly),
      ),
    60, [CACHE_TAGS.products]),
  ),
  listRelatedProducts: reactCache((categoryId: string, excludeId: string, limit = 4) =>
    cached(["repo-related", categoryId, excludeId, String(limit)], () =>
      supabaseOrLocal(
        () => sbListRelatedProducts(categoryId, excludeId, limit),
        () => localListRelatedProducts(categoryId, excludeId, limit),
      ),
    60, [CACHE_TAGS.products]),
  ),
  listArticles: reactCache((opts?: { publishedOnly?: boolean }) => {
    const publishedOnly = Boolean(opts?.publishedOnly);
    return cached(["repo-articles", String(publishedOnly)], () =>
      supabaseOrLocal(
        () => sbListArticles({ publishedOnly }),
        () => localListArticles({ publishedOnly }),
      ),
    300, [CACHE_TAGS.articles]);
  }),
  getArticleBySlug: reactCache((slug: string, publishedOnly = true) =>
    cached(["repo-article-slug", slug, String(publishedOnly)], () =>
      supabaseOrLocal(
        () => sbGetArticleBySlug(slug, publishedOnly),
        () => localGetArticleBySlug(slug, publishedOnly),
      ),
    300, [CACHE_TAGS.articles]),
  ),
};
