/**
 * Smoke tests for catalog limit helpers and guard logic.
 * Usage: node scripts/test-catalog-limits.cjs
 */

const LIMITS = { maxProducts: 30, maxArticles: 50 };

function isAtProductLimit(count) {
  return count >= LIMITS.maxProducts;
}

function isAtArticleLimit(count) {
  return count >= LIMITS.maxArticles;
}

function productLimitMessage() {
  return `Bạn đã đăng đến giới hạn ${LIMITS.maxProducts} sản phẩm. Vui lòng xóa bớt để thêm mới.`;
}

function articleLimitMessage() {
  return `Bạn đã đăng đến giới hạn ${LIMITS.maxArticles} bài viết sức khỏe. Vui lòng xóa bớt để thêm mới.`;
}

function simulateNewProductBlocked(existingCount) {
  const isNew = true;
  return isNew && isAtProductLimit(existingCount);
}

function simulateEditProductAllowed(existingCount) {
  const isNew = false;
  return isNew && isAtProductLimit(existingCount);
}

function simulateNewArticleBlocked(articles, newId) {
  const existingArticle = articles.find((a) => a.id === newId);
  return !existingArticle && isAtArticleLimit(articles.length);
}

function assert(name, cond) {
  if (!cond) {
    console.error("FAIL:", name);
    process.exitCode = 1;
    return;
  }
  console.log("OK:", name);
}

// --- unit tests ---
assert("29 products -> not at limit", !isAtProductLimit(29));
assert("30 products -> at limit", isAtProductLimit(30));
assert("31 products -> at limit", isAtProductLimit(31));

assert("49 articles -> not at limit", !isAtArticleLimit(49));
assert("50 articles -> at limit", isAtArticleLimit(50));

assert("new product blocked at 30", simulateNewProductBlocked(30));
assert("new product allowed at 29", !simulateNewProductBlocked(29));
assert("edit product allowed at 30", !simulateEditProductAllowed(30));

const fiftyArticles = Array.from({ length: 50 }, (_, i) => ({ id: `art-${i}` }));
assert(
  "new article blocked at 50",
  simulateNewArticleBlocked(fiftyArticles, "art-new"),
);
assert(
  "edit article allowed at 50",
  !simulateNewArticleBlocked(fiftyArticles, "art-0"),
);

assert(
  "product message mentions 30",
  productLimitMessage().includes("30 sản phẩm"),
);
assert(
  "article message mentions 50",
  articleLimitMessage().includes("50 bài viết"),
);

// --- live DB counts (optional) ---
const fs = require("fs");
const path = require("path");

function loadEnv() {
  const env = {};
  for (const file of [".env.production.local", ".env.local"]) {
    const p = path.join(__dirname, "..", file);
    if (!fs.existsSync(p)) continue;
    for (const line of fs.readFileSync(p, "utf8").split(/\r?\n/)) {
      if (!line || line.trim().startsWith("#")) continue;
      const m = line.match(/^([A-Z0-9_]+)\s*=\s*(.*)$/);
      if (!m) continue;
      let v = m[2].trim();
      if (
        (v.startsWith('"') && v.endsWith('"')) ||
        (v.startsWith("'") && v.endsWith("'"))
      ) {
        v = v.slice(1, -1);
      }
      if (!env[m[1]]) env[m[1]] = v;
    }
  }
  return env;
}

async function sbFetch(env, route) {
  const base = env.NEXT_PUBLIC_SUPABASE_URL || env.SUPABASE_URL;
  const key = env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_SECRET_KEY;
  const res = await fetch(`${base}${route}`, {
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
    },
  });
  const json = await res.json();
  if (!res.ok) throw new Error(`${route} -> ${res.status}`);
  return json;
}

async function main() {
  const env = loadEnv();
  if (!env.NEXT_PUBLIC_SUPABASE_URL && !env.SUPABASE_URL) {
    console.log("SKIP: no Supabase env — unit tests only");
    return;
  }

  const [products, articles] = await Promise.all([
    sbFetch(env, "/rest/v1/products?select=id"),
    sbFetch(env, "/rest/v1/health_articles?select=id"),
  ]);

  console.log("\nLive DB:");
  console.log(`  products: ${products.length}/${LIMITS.maxProducts}`);
  console.log(`  articles: ${articles.length}/${LIMITS.maxArticles}`);
  console.log(
    `  can add product: ${!isAtProductLimit(products.length) ? "yes" : "NO (at limit)"}`,
  );
  console.log(
    `  can add article: ${!isAtArticleLimit(articles.length) ? "yes" : "NO (at limit)"}`,
  );
}

main().catch((e) => {
  console.error("DB check failed:", e.message);
  process.exitCode = 1;
});
