/**
 * Reset catalog data for client handoff.
 * Keeps: site_settings (email/branding/bank), categories, admin (env-based)
 * Clears: products, orders, order_items, health_articles, media_files
 *
 * Usage: node scripts/reset-catalog.cjs
 */
const fs = require("fs");
const path = require("path");
const { createClient } = require("@supabase/supabase-js");

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

async function clearTable(sb, name) {
  const { error } = await sb.from(name).delete().neq("id", "__none__");
  if (error) {
    if (
      error.code === "PGRST205" ||
      error.message?.includes("Could not find")
    ) {
      console.log(`skip ${name}: table missing`);
      return;
    }
    throw error;
  }
  console.log(`cleared ${name}`);
}

async function main() {
  const env = loadEnv();
  const url = env.NEXT_PUBLIC_SUPABASE_URL || env.SUPABASE_URL;
  const key = env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_SECRET_KEY;
  if (!url || !key) throw new Error("Missing Supabase credentials");

  const sb = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  // order_items first (FK to orders)
  await clearTable(sb, "order_items");
  await clearTable(sb, "orders");
  await clearTable(sb, "products");
  await clearTable(sb, "health_articles");
  await clearTable(sb, "media_files");

  const { data: cats, error: cErr } = await sb
    .from("categories")
    .select("id,name")
    .order("sort");
  if (cErr) throw cErr;

  const { data: settings, error: sErr } = await sb
    .from("site_settings")
    .select("shop_name,email,phone")
    .limit(1)
    .maybeSingle();
  if (sErr) throw sErr;

  console.log(
    "OK — kept categories:",
    (cats ?? []).map((c) => c.name).join(", ") || "(none)",
  );
  console.log("OK — kept settings:", settings?.shop_name, settings?.email);
  console.log(
    "Admin login remains via ADMIN_EMAIL / ADMIN_PASSWORD env on Vercel.",
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
