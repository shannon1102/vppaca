/**
 * Aggregate paper SKUs from docs/products/by-category/giay-* → src/data/vpp-paper-products.generated.json
 * Run: node scripts/generate-paper-seed-from-docs.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const docsCat = path.join(root, "docs/products/by-category");

const SKIP_SPEC_KEYS = new Set([
  "Địa Chỉ",
  "Điện thoại",
  "Hotline",
  "Email",
  "gsm_inferred",
  "size_inferred",
]);

const PHOTO_CYCLE = [
  "/products/giay-a4-ream-01.jpg",
  "/products/giay-a4-ream-02.jpg",
  "/products/giay-a4-box.jpg",
];

function cleanSpecs(specs) {
  if (!specs || typeof specs !== "object") return {};
  const out = {};
  for (const [k, v] of Object.entries(specs)) {
    if (SKIP_SPEC_KEYS.has(k)) continue;
    if (typeof v !== "string" && typeof v !== "number") continue;
    const s = String(v).trim();
    if (s.length > 120) continue;
    if (/ba nhất|vanphongphambanhat|0937/i.test(s)) continue;
    out[k] = s;
  }
  return out;
}

function pickBrand(name, specs) {
  const fromSpec = specs["Thương hiệu"];
  if (fromSpec && fromSpec.length < 40) return fromSpec;
  const brands = [
    "Clever Up",
    "Bãi Bằng Classic",
    "Bãi Bằng",
    "Double A",
    "Excel",
    "IK Plus",
    "IK One",
    "IK Yellow",
    "IK Natural",
    "IK",
    "PaperOne",
    "PaperLine",
    "A-One",
    "Supreme",
    "Delight",
    "VIVA",
    "Quality",
    "Smartist",
    "Chenming",
    "Emerald",
    "Idea Max",
    "Idea",
  ];
  const n = name.toLowerCase();
  for (const b of brands) {
    if (n.includes(b.toLowerCase().replace(/\s+/g, " "))) return b;
  }
  return "ACA Partner";
}

function inferFilter(specs, name) {
  const size =
    specs["Kích thước"]?.match(/A[0-9]/i)?.[0]?.toUpperCase() ??
    specs.size_inferred ??
    (name.match(/\bA[0-9]\b/i)?.[0]?.toUpperCase() ?? "");
  const gsm =
    specs["Định lượng"]?.match(/\d+/)?.[0] ??
    specs.gsm_inferred ??
    name.match(/(\d+)\s*gsm/i)?.[1] ??
    "";
  const thuong_hieu = pickBrand(name, specs);
  const out = {};
  if (size) out.kho = size;
  if (gsm) out.gsm = gsm;
  if (thuong_hieu) out.thuong_hieu = thuong_hieu;
  return out;
}

function acaDescription(name, specs) {
  const size = specs["Kích thước"]?.includes("A")
    ? specs["Kích thước"].match(/A[0-9]/i)?.[0]?.toUpperCase()
    : "";
  const gsm = specs["Định lượng"] ?? "";
  const origin = specs["Xuất xứ"] ? ` Xuất xứ ${specs["Xuất xứ"]}.` : "";
  const pack = specs["Quy cách đóng gói"] || specs["Đóng gói"] || "500 tờ/ram, 5 ram/thùng";
  return `${name} — ${gsm}${size ? ` khổ ${size}` : ""}, phù hợp in và photocopy văn phòng.${origin} Quy cách: ${pack}.`;
}

function detailHtml(specs) {
  const rows = [
    ["Khổ", specs["Kích thước"]],
    ["Định lượng", specs["Định lượng"]],
    ["Số tờ/ram", specs["Số lượng"] || "500 tờ"],
    ["Màu giấy", specs["Giấy màu"] || specs["Màu sắc"]],
    ["Thương hiệu", specs["Thương hiệu"]],
    ["Xuất xứ", specs["Xuất xứ"]],
    ["Đóng gói", specs["Quy cách đóng gói"] || specs["Đóng gói"]],
    ["Ứng dụng", specs["Ứng dụng"]],
    ["Trọng lượng", specs["Trọng lượng"]],
  ].filter(([, v]) => v && String(v).length < 100);
  if (!rows.length) return "<p>Giấy văn phòng chính hãng — giao nhanh, hỗ trợ báo giá sỉ.</p>";
  const lis = rows.map(([k, v]) => `<li><strong>${k}:</strong> ${v}</li>`).join("");
  return `<p>Thông số sản phẩm (theo niêm yết nhà sản xuất):</p><ul>${lis}</ul><p>Giá sỉ theo số lượng — liên hệ ACA hoặc upload Excel tại trang báo giá B2B.</p>`;
}

function normalizeSku(slug, sku) {
  if (sku && typeof sku === "string" && sku.length <= 32) {
    return sku.replace(/\s+/g, "-").toUpperCase();
  }
  const base = slug.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "").toUpperCase();
  return `GIAY-${base.slice(0, 24)}`;
}

function isExcludedPaperItem(item, folder) {
  if (folder === "giay-decal") return true;
  const slug = item.slug ?? "";
  if (slug.startsWith("giay-decal-")) return true;
  if (slug.startsWith("nhan-tomy-")) return true;
  const name = (item.name ?? "").trim();
  if (/^(Giấy Decal|Nhãn Tomy)/i.test(name)) return true;
  return false;
}

const FOLDER_TO_CAT = {
  "giay-a4": "cat-giay-a4",
  "giay-a3": "cat-giay-a3-a5",
  "giay-a5": "cat-giay-a3-a5",
  "giay-in-anh": "cat-giay-in-anh",
  "giay-note-phan-trang": "cat-giay-note",
  "giay-a0-giay-a1": "cat-giay-kho-lon",
  "giay-lien-tuc": "cat-giay-lien-tuc",
  "giay-in-nhiet": "cat-giay-nhiet",
  "giay-bia-mau": "cat-giay-bia-mau",
  "giay-ford-mau": "cat-giay-bia-mau",
  "giay-than": "cat-giay-than",
};

function resolveCategoryId(folder, item, specs) {
  if (FOLDER_TO_CAT[folder]) return FOLDER_TO_CAT[folder];
  const size =
    specs.size_inferred ||
    specs["Kích thước"]?.match(/A[0-9]/i)?.[0]?.toUpperCase() ||
    item.name.match(/\bA[0-9]\b/i)?.[0]?.toUpperCase();
  if (size === "A4") return "cat-giay-a4";
  if (size === "A3" || size === "A5") return "cat-giay-a3-a5";
  if (/note|stick|phân trang|pronoti/i.test(item.name)) return "cat-giay-note";
  if (/liên tục|lien tuc/i.test(item.name)) return "cat-giay-lien-tuc";
  if (/nhiệt|nhiet|fax|bill/i.test(item.name)) return "cat-giay-nhiet";
  if (/bìa|ford|plastic|ép/i.test(item.name)) return "cat-giay-bia-mau";
  if (/than|niêm/i.test(item.name)) return "cat-giay-than";
  if (/in ảnh|in anh|photo|gsm.*1[3-9]0|230|260|300/i.test(item.name)) return "cat-giay-in-anh";
  if (/a0|a1|khổ lớn/i.test(item.name)) return "cat-giay-kho-lon";
  return "cat-giay-a4";
}

function loadAllPaperItems() {
  const bySlug = new Map();
  if (!fs.existsSync(docsCat)) {
    console.error("Missing", docsCat);
    process.exit(1);
  }
  for (const dir of fs.readdirSync(docsCat)) {
    if (!dir.startsWith("giay")) continue;
    const itemsPath = path.join(docsCat, dir, "items.json");
    if (!fs.existsSync(itemsPath)) continue;
    const data = JSON.parse(fs.readFileSync(itemsPath, "utf8"));
    for (const item of data.items ?? []) {
      if (!item.slug || !item.name) continue;
      if (isExcludedPaperItem(item, dir)) continue;
      if (item.aca_category_hint && item.aca_category_hint !== "cat-giay") continue;
      if (!bySlug.has(item.slug)) bySlug.set(item.slug, { ...item, sourceFolder: dir });
    }
  }
  return [...bySlug.values()].sort((a, b) => a.name.localeCompare(b.name, "vi"));
}

const items = loadAllPaperItems();
let idx = 0;
const products = items.map((item) => {
  const specs = cleanSpecs(item.specs);
  const brand = pickBrand(item.name, specs);
  const filter_attrs = inferFilter(specs, item.name);
  const id = `p-doc-${item.slug.slice(0, 48)}`;
  const price = Number(item.regular_price || item.price) || 50000;
  const sale =
    item.price && item.regular_price && item.price < item.regular_price
      ? Number(item.price)
      : null;
  const photo = PHOTO_CYCLE[idx % PHOTO_CYCLE.length];
  idx += 1;
  const featured =
    /excel|double a|ik plus|paperone|a-one|a4.*70/i.test(item.name) && idx < 30;

  return {
    id,
    sku: normalizeSku(item.slug, item.sku),
    name: item.name.replace(/\s+/g, " ").trim(),
    slug: item.slug,
    price,
    sale_price: sale,
    description: acaDescription(item.name, specs),
    detail_description: detailHtml(specs),
    specs: Object.fromEntries(
      Object.entries({
        "Khổ giấy": filter_attrs.kho || specs["Kích thước"]?.match(/A[0-9]/i)?.[0],
        "Định lượng": specs["Định lượng"] || (filter_attrs.gsm ? `${filter_attrs.gsm}gsm` : ""),
        "Thương hiệu": brand,
        "Xuất xứ": specs["Xuất xứ"],
        "Quy cách": specs["Quy cách đóng gói"] || specs["Đóng gói"],
      }).filter(([, v]) => v),
    ),
    category_id: resolveCategoryId(item.sourceFolder ?? "", item, item.specs ?? {}),
    stock: 100 + (idx % 40) * 10,
    sold_count: 50 + (idx % 100) * 11,
    is_published: true,
    is_featured: featured,
    seo_title: `${item.name} | Giá sỉ VPPACA`,
    seo_description: acaDescription(item.name, specs).slice(0, 155),
    brand,
    base_uom_code: "ram",
    min_stock: 20,
    filter_attrs,
    imagePaths: [photo, PHOTO_CYCLE[(idx + 1) % PHOTO_CYCLE.length]],
  };
});

const outPath = path.join(root, "src/data/vpp-paper-products.generated.json");
fs.writeFileSync(outPath, JSON.stringify({ generatedAt: new Date().toISOString(), count: products.length, products }, null, 2));
console.log(`Wrote ${products.length} paper products → ${path.relative(root, outPath)}`);
