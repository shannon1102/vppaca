import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  defaultSettings,
  seedBanners,
  seedCategories,
  seedProducts,
  seedPromotionProducts,
  seedPromotions,
  seedTiers,
  seedUoms,
} from "@/data/vpp-catalog";

function loadEnvFile() {
  const root = process.cwd();
  for (const file of [".env.local", ".env"]) {
    const p = path.join(root, file);
    if (!fs.existsSync(p)) continue;
    for (const line of fs.readFileSync(p, "utf8").split(/\r?\n/)) {
      if (!line || line.trim().startsWith("#")) continue;
      const i = line.indexOf("=");
      if (i < 0) continue;
      const k = line.slice(0, i);
      let v = line.slice(i + 1).trim();
      if (
        (v.startsWith('"') && v.endsWith('"')) ||
        (v.startsWith("'") && v.endsWith("'"))
      )
        v = v.slice(1, -1);
      if (!process.env[k]) process.env[k] = v;
    }
  }
}

function env(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env ${name}`);
  return v;
}

loadEnvFile();

function headers(key: string) {
  return {
    apikey: key,
    Authorization: `Bearer ${key}`,
    "Content-Type": "application/json",
    Prefer: "return=minimal",
  };
}

async function rest(
  base: string,
  key: string,
  route: string,
  init?: RequestInit,
) {
  const res = await fetch(`${base}${route}`, {
    ...init,
    headers: { ...headers(key), ...(init?.headers as Record<string, string>) },
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`${route} ${res.status}: ${text.slice(0, 400)}`);
  return text ? JSON.parse(text) : null;
}

async function main() {
  const base = env("NEXT_PUBLIC_SUPABASE_URL");
  const key = env("SUPABASE_SERVICE_ROLE_KEY");

  const { count } = await fetch(`${base}/rest/v1/products?select=id`, {
    headers: { ...headers(key), Prefer: "count=exact" },
  }).then(async (r) => ({
    count: Number(r.headers.get("content-range")?.split("/")[1] ?? 0),
  }));

  if (count > 0) {
    console.log(`products already seeded (${count}) — skip insert`);
    return;
  }

  console.log("Seeding site_settings, categories, products…");

  const { id: _settingsId, ...settingsRow } = defaultSettings;
  const existingSettings = await fetch(`${base}/rest/v1/site_settings?select=id&limit=1`, {
    headers: headers(key),
  }).then((r) => r.json() as Promise<{ id: string }[]>);
  if (!existingSettings?.length) {
    await rest(base, key, "/rest/v1/site_settings", {
      method: "POST",
      body: JSON.stringify([settingsRow]),
    });
  } else {
    await rest(base, key, `/rest/v1/site_settings?id=eq.${existingSettings[0]!.id}`, {
      method: "PATCH",
      body: JSON.stringify(settingsRow),
    });
  }

  await rest(base, key, "/rest/v1/categories", {
    method: "POST",
    body: JSON.stringify(seedCategories),
    headers: { Prefer: "resolution=merge-duplicates,return=minimal" },
  });

  const productRows = seedProducts.map((p) => {
    const row = { ...p } as Record<string, unknown>;
    delete row.imagePaths;
    delete row.imageIndex;
    return row;
  });

  const batch = 50;
  for (let i = 0; i < productRows.length; i += batch) {
    const chunk = productRows.slice(i, i + batch);
    await rest(base, key, "/rest/v1/products", {
      method: "POST",
      body: JSON.stringify(chunk),
    });
    console.log(`  products ${Math.min(i + batch, seedProducts.length)}/${seedProducts.length}`);
  }

  await rest(base, key, "/rest/v1/product_uoms", {
    method: "POST",
    body: JSON.stringify(seedUoms),
  });
  await rest(base, key, "/rest/v1/product_price_tiers", {
    method: "POST",
    body: JSON.stringify(seedTiers),
  });
  await rest(base, key, "/rest/v1/banners", {
    method: "POST",
    body: JSON.stringify(seedBanners),
  });
  await rest(base, key, "/rest/v1/promotions", {
    method: "POST",
    body: JSON.stringify(seedPromotions),
  });
  await rest(base, key, "/rest/v1/promotion_products", {
    method: "POST",
    body: JSON.stringify(seedPromotionProducts),
  });

  console.log("Seed OK");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
