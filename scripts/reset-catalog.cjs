/**
 * Reset catalog data for client handoff.
 * Keeps: site_settings (email/branding/bank), categories, admin (env-based)
 * Clears: products, orders, order_items, health_articles, media_files + storage bucket
 *
 * Usage: node scripts/reset-catalog.cjs
 */
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");

function loadEnv() {
  const env = {};
  for (const file of [".env.production.local", ".env.local"]) {
    const p = path.join(root, file);
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

function sbHeaders(key) {
  return {
    apikey: key,
    Authorization: `Bearer ${key}`,
    "Content-Type": "application/json",
  };
}

async function sbFetch(env, route, opts = {}) {
  const base = env.NEXT_PUBLIC_SUPABASE_URL || env.SUPABASE_URL;
  const key = env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_SECRET_KEY;
  const res = await fetch(`${base}${route}`, {
    ...opts,
    headers: { ...sbHeaders(key), ...(opts.headers || {}) },
  });
  const text = await res.text();
  let json = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    json = text;
  }
  if (!res.ok) {
    const msg =
      typeof json === "object" && json?.message
        ? json.message
        : text || res.statusText;
    const err = new Error(`${route} failed (${res.status}): ${msg}`);
    err.status = res.status;
    err.body = json;
    throw err;
  }
  return json;
}

async function clearTable(env, name) {
  try {
    await sbFetch(env, `/rest/v1/${name}?id=neq.__none__`, {
      method: "DELETE",
      headers: { Prefer: "return=minimal" },
    });
    console.log(`cleared ${name}`);
  } catch (e) {
    if (
      e.status === 404 ||
      String(e.message).includes("Could not find") ||
      String(e.message).includes("PGRST205")
    ) {
      console.log(`skip ${name}: table missing`);
      return;
    }
    throw e;
  }
}

async function clearStorageBucket(env) {
  const limit = 100;
  let offset = 0;
  let removed = 0;

  while (true) {
    const list = await sbFetch(env, "/storage/v1/object/list/media", {
      method: "POST",
      body: JSON.stringify({ prefix: "", limit, offset }),
    });
    if (!Array.isArray(list) || list.length === 0) break;

    const names = list.map((f) => f.name).filter(Boolean);
    if (names.length) {
      await sbFetch(env, "/storage/v1/object/media", {
        method: "DELETE",
        body: JSON.stringify({ prefixes: names }),
      });
      removed += names.length;
    }

    if (list.length < limit) break;
    offset += limit;
  }

  console.log(`cleared storage bucket: ${removed} file(s)`);
}

async function main() {
  const env = loadEnv();
  const url = env.NEXT_PUBLIC_SUPABASE_URL || env.SUPABASE_URL;
  const key = env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_SECRET_KEY;
  if (!url || !key) throw new Error("Missing Supabase credentials");

  // order_items first (FK to orders)
  await clearTable(env, "order_items");
  await clearTable(env, "orders");
  await clearTable(env, "products");
  await clearTable(env, "health_articles");
  await clearTable(env, "media_files");
  await clearStorageBucket(env);

  const cats = await sbFetch(
    env,
    "/rest/v1/categories?select=id,name&order=sort.asc",
  );
  const settings = await sbFetch(
    env,
    "/rest/v1/site_settings?select=shop_name,email,phone&limit=1",
  );

  console.log(
    "OK — kept categories:",
    (cats ?? []).map((c) => c.name).join(", ") || "(none)",
  );
  console.log(
    "OK — kept settings:",
    settings?.[0]?.shop_name ?? settings?.shop_name,
    settings?.[0]?.email ?? settings?.email,
  );
  console.log(
    "Admin login remains via ADMIN_EMAIL / ADMIN_PASSWORD env on Vercel.",
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
