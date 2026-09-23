/**
 * Đồng bộ ảnh sản phẩm + danh mục từ seed lên Supabase (chỉ cột images / image_url).
 *
 * Cần .env.local hoặc .env.production.local:
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 *
 * Usage:
 *   npm run sync:product-images
 *   npm run sync:product-images -- --dry-run
 */
import fs from "node:fs";
import path from "node:path";
import { vppSyncProductImagesFromSeed } from "@/lib/data/vpp-data";

function loadEnvFile() {
  const root = process.cwd();
  for (const file of [".env.production.local", ".env.local", ".env"]) {
    const p = path.join(root, file);
    if (!fs.existsSync(p)) continue;
    for (const line of fs.readFileSync(p, "utf8").split(/\r?\n/)) {
      if (!line || line.trim().startsWith("#")) continue;
      const i = line.indexOf("=");
      if (i < 0) continue;
      const k = line.slice(0, i).trim();
      let v = line.slice(i + 1).trim();
      if (
        (v.startsWith('"') && v.endsWith('"')) ||
        (v.startsWith("'") && v.endsWith("'"))
      ) {
        v = v.slice(1, -1);
      }
      if (!process.env[k]) process.env[k] = v;
    }
  }
}

async function main() {
  loadEnvFile();
  const dryRun = process.argv.includes("--dry-run");

  console.log(
    dryRun
      ? "Dry-run — không ghi Supabase"
      : "Đang cập nhật Supabase từ seed…",
  );

  const result = await vppSyncProductImagesFromSeed({ dryRun });

  console.log(JSON.stringify(result, null, 2));
  console.log(
    dryRun
      ? `Sẽ cập nhật ${result.productsUpdated} sản phẩm, ${result.categoriesUpdated} danh mục.`
      : `Xong: ${result.productsUpdated} sản phẩm, ${result.categoriesUpdated} danh mục.`,
  );
  if (result.productsNotInDb > 0) {
    console.log(
      `Lưu ý: ${result.productsNotInDb} SKU trong seed không có hàng tương ứng trên DB (bỏ qua).`,
    );
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
