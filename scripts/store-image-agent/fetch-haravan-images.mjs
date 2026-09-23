#!/usr/bin/env node
/**
 * Crawl product images from Haravan/Hstatic shops via public products.json API.
 *
 * Example:
 *   node scripts/store-image-agent/fetch-haravan-images.mjs \
 *     --config scripts/store-image-agent/configs/thienlong-but-viet.json
 *
 *   node scripts/store-image-agent/fetch-haravan-images.mjs \
 *     --url https://thienlong.vn --collection but-viet \
 *     --out docs/products/reference/thienlong/but-viet --max-pages 1
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  extensionFromUrl,
  fetchAllCollectionProducts,
  pickProductImages,
  productPageUrl,
  safeFilenamePart,
  sleep,
} from "./lib/haravan.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.join(__dirname, "../..");

function usage() {
  console.log(`Usage:
  fetch-haravan-images.mjs --config <path.json>
  fetch-haravan-images.mjs --url <base> --collection <handle> --out <dir> [options]

Options:
  --all-images       Download every image on the product (default: first only)
  --max-pages <n>    Stop after N API pages (0 = all)
  --dry-run          List downloads without writing files
  --delay-ms <n>     Pause between API pages (default 400)
  --help
`);
}

function parseArgs(argv) {
  const out = {
    config: null,
    baseUrl: null,
    collectionHandle: null,
    outputDir: null,
    allImages: false,
    maxPages: 0,
    dryRun: false,
    delayMs: 400,
    acaCategoryHint: null,
    name: null,
  };

  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--help" || a === "-h") {
      out.help = true;
      continue;
    }
    if (a === "--config") {
      out.config = argv[++i];
      continue;
    }
    if (a === "--url") {
      out.baseUrl = argv[++i];
      continue;
    }
    if (a === "--collection") {
      out.collectionHandle = argv[++i];
      continue;
    }
    if (a === "--out") {
      out.outputDir = argv[++i];
      continue;
    }
    if (a === "--all-images") {
      out.allImages = true;
      continue;
    }
    if (a === "--max-pages") {
      out.maxPages = Number(argv[++i]) || 0;
      continue;
    }
    if (a === "--dry-run") {
      out.dryRun = true;
      continue;
    }
    if (a === "--delay-ms") {
      out.delayMs = Number(argv[++i]) || 400;
      continue;
    }
    throw new Error(`Unknown argument: ${a}`);
  }
  return out;
}

function loadConfig(configPath) {
  const abs = path.isAbsolute(configPath)
    ? configPath
    : path.join(process.cwd(), configPath);
  const raw = JSON.parse(fs.readFileSync(abs, "utf8"));
  return {
    name: raw.name ?? null,
    baseUrl: raw.baseUrl,
    collectionHandle: raw.collectionHandle,
    outputDir: raw.outputDir,
    acaCategoryHint: raw.acaCategoryHint ?? null,
    allImages: Boolean(raw.allImages),
    maxPages: Number(raw.maxPages) || 0,
    delayMs: Number(raw.delayMs) || 400,
  };
}

async function downloadFile(url, destPath, dryRun) {
  if (dryRun) return { ok: true, skipped: false, bytes: 0 };
  if (fs.existsSync(destPath)) {
    return { ok: true, skipped: true, bytes: fs.statSync(destPath).size };
  }

  const res = await fetch(url, {
    headers: {
      "User-Agent": "vppaca-store-image-agent/1.0 (+https://vppaca.vn; catalog reference)",
    },
  });
  if (!res.ok) {
    return { ok: false, skipped: false, error: `HTTP ${res.status}` };
  }
  const buf = Buffer.from(await res.arrayBuffer());
  fs.mkdirSync(path.dirname(destPath), { recursive: true });
  fs.writeFileSync(destPath, buf);
  return { ok: true, skipped: false, bytes: buf.length };
}

async function main() {
  const args = parseArgs(process.argv);
  if (args.help) {
    usage();
    process.exit(0);
  }

  let cfg = args;
  if (args.config) {
    const fromFile = loadConfig(args.config);
    cfg = {
      ...fromFile,
      config: args.config,
      baseUrl: args.baseUrl ?? fromFile.baseUrl,
      collectionHandle: args.collectionHandle ?? fromFile.collectionHandle,
      outputDir: args.outputDir ?? fromFile.outputDir,
      allImages: args.allImages || fromFile.allImages,
      maxPages: args.maxPages || fromFile.maxPages,
      delayMs: args.delayMs ?? fromFile.delayMs,
      dryRun: args.dryRun,
    };
  }

  if (!cfg.baseUrl || !cfg.collectionHandle || !cfg.outputDir) {
    usage();
    process.exit(1);
  }

  const outputAbs = path.isAbsolute(cfg.outputDir)
    ? cfg.outputDir
    : path.join(repoRoot, cfg.outputDir);
  const imagesDir = path.join(outputAbs, "images");
  const fetchedAt = new Date().toISOString();

  console.log(
    cfg.name
      ? `Store image agent — ${cfg.name}`
      : "Store image agent — Haravan collection",
  );
  console.log(`  Shop:       ${cfg.baseUrl}`);
  console.log(`  Collection: ${cfg.collectionHandle}`);
  console.log(`  Output:     ${outputAbs}`);
  if (cfg.dryRun) console.log("  (dry-run — no files written)");

  const products = await fetchAllCollectionProducts({
    baseUrl: cfg.baseUrl,
    collectionHandle: cfg.collectionHandle,
    maxPages: cfg.maxPages,
    delayMs: cfg.delayMs,
    log: (m) => console.log(m),
  });

  const manifest = [];
  let downloaded = 0;
  let skipped = 0;
  let failed = 0;

  for (const product of products) {
    const handle = product.handle;
    const imageUrls = pickProductImages(product, { allImages: cfg.allImages });
    const localFiles = [];

    for (let i = 0; i < imageUrls.length; i++) {
      const url = imageUrls[i];
      const ext = extensionFromUrl(url);
      const suffix = imageUrls.length > 1 ? `-${i + 1}` : "";
      const filename = `${safeFilenamePart(handle)}${suffix}.${ext}`;
      const destPath = path.join(imagesDir, filename);
      const relPath = path.relative(repoRoot, destPath).split(path.sep).join("/");

      const result = await downloadFile(url, destPath, cfg.dryRun);
      if (!result.ok) {
        failed += 1;
        console.warn(`  FAIL ${handle}: ${url} — ${result.error}`);
        continue;
      }
      if (result.skipped) skipped += 1;
      else downloaded += 1;

      localFiles.push({
        url,
        path: relPath,
        bytes: result.bytes ?? null,
        skipped_existing: Boolean(result.skipped),
      });

      if (!cfg.dryRun && !result.skipped) await sleep(150);
    }

    manifest.push({
      handle,
      title: product.title,
      vendor: product.vendor ?? null,
      product_type: product.product_type ?? null,
      source_url: productPageUrl(cfg.baseUrl, handle),
      aca_category_hint: cfg.acaCategoryHint,
      image_urls: imageUrls,
      local_files: localFiles,
    });
  }

  const meta = {
    source: {
      platform: "haravan",
      base_url: cfg.baseUrl,
      collection_handle: cfg.collectionHandle,
      collection_url: `${cfg.baseUrl.replace(/\/$/, "")}/collections/${cfg.collectionHandle}`,
    },
    fetched_at: fetchedAt,
    product_count: manifest.length,
    download_stats: { downloaded, skipped_existing: skipped, failed },
    config: cfg.config ?? null,
  };

  if (!cfg.dryRun) {
    fs.mkdirSync(outputAbs, { recursive: true });
    fs.writeFileSync(
      path.join(outputAbs, "products.json"),
      `${JSON.stringify({ meta, products: manifest }, null, 2)}\n`,
    );
    fs.writeFileSync(
      path.join(outputAbs, "meta.json"),
      `${JSON.stringify(meta, null, 2)}\n`,
    );
  }

  console.log(
    `\nDone: ${manifest.length} products, ${downloaded} new files, ${skipped} already on disk, ${failed} failed.`,
  );
  if (!cfg.dryRun) {
    console.log(`Manifest: ${path.join(outputAbs, "products.json")}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
