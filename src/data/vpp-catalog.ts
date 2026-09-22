import type {
  Banner,
  Category,
  Product,
  ProductPriceTier,
  ProductUom,
  Promotion,
  PromotionProduct,
  SiteSettings,
} from "@/lib/types";
import { BRAND_COLORS } from "@/lib/brand-colors";
import paperCatalog from "@/data/vpp-paper-products.generated.json";
import {
  giayA4BrandProducts,
  giayA4BrandSuppressSlugs,
} from "@/data/giay-a4-brand-products";
import {
  GIAY_A4_CATEGORY_HERO,
  resolveGiayA4BrandImages,
} from "@/data/giay-a4-brand-images";

export const defaultSettings: SiteSettings = {
  id: "default",
  shop_name: "ACA — Văn phòng phẩm",
  tagline: "VPP chính hãng — B2C & B2B, giao nhanh toàn quốc",
  phone: "1900 1234",
  email: "sales@vppaca.vn",
  address: "Hà Nội, Việt Nam",
  logo_url: "/brand/aca-logo-linear-gradient-red-yellow.png",
  favicon_url: "/brand/aca-icon.svg",
  primary_color: BRAND_COLORS.primary,
  secondary_color: BRAND_COLORS.secondary,
  accent_color: BRAND_COLORS.accent,
  bank_name: "Vietcombank",
  bank_account: "0123456789",
  bank_holder: "CONG TY TNHH VPP ACA",
  bank_bin: "970436",
  transfer_content_template: "DH {code}",
  qr_image_url: "",
  facebook_url: "https://facebook.com/vppaca",
  zalo_url: "https://zalo.me/19001234",
};

export const seedCategories: Category[] = [
  {
    id: "cat-giay",
    name: "Giấy in các loại",
    slug: "giay-in-so-vo",
    description: "Giấy in A4, A3, A5, in ảnh, liên tục, nhiệt và bìa màu",
    sort: 1,
    image_url: "/products/giay-a4-ream-01.jpg",
    parent_id: null,
  },
  {
    id: "cat-giay-a4",
    name: "Giấy A4",
    slug: "giay-a4",
    description:
      "Giấy photocopy A4 60–80gsm: Excel, Double A, PaperOne, Clever Up, Bãi Bằng, IK, Quality, Idea Max, Smartist…",
    sort: 1,
    image_url: GIAY_A4_CATEGORY_HERO,
    parent_id: "cat-giay",
  },
  {
    id: "cat-giay-a3-a5",
    name: "Giấy A3, A5",
    slug: "giay-a3-a5",
    description: "Giấy in khổ A3 và A5 văn phòng, in ảnh lớn",
    sort: 2,
    image_url: "/products/giay-a4-ream-02.jpg",
    parent_id: "cat-giay",
  },
  {
    id: "cat-giay-in-anh",
    name: "Giấy in ảnh",
    slug: "giay-in-anh",
    description: "Giấy in ảnh 1 mặt, 2 mặt — 135–300gsm",
    sort: 3,
    image_url: "/products/giay-a4-box.jpg",
    parent_id: "cat-giay",
  },
  {
    id: "cat-giay-note",
    name: "Giấy Note 3M, phân trang",
    slug: "giay-note-phan-trang",
    description: "Giấy note dán, phân trang, sticky",
    sort: 4,
    image_url: "/products/vo-so.jpg",
    parent_id: "cat-giay",
  },
  {
    id: "cat-giay-decal",
    name: "Giấy Decal",
    slug: "giay-decal",
    description: "Decal in ấn, nhãn Tomy",
    sort: 5,
    image_url: "/products/giay-a4-box.jpg",
    parent_id: "cat-giay",
  },
  {
    id: "cat-giay-kho-lon",
    name: "Giấy khổ lớn A1, A0",
    slug: "giay-a1-a0",
    description: "Giấy cuộn và tờ khổ A1, A0",
    sort: 6,
    image_url: "/products/giay-a4-ream-02.jpg",
    parent_id: "cat-giay",
  },
  {
    id: "cat-giay-lien-tuc",
    name: "Giấy in liên tục",
    slug: "giay-in-lien-tuc",
    description: "Giấy in liên tục 1–5 liên, hóa đơn",
    sort: 7,
    image_url: "/products/giay-a4-box.jpg",
    parent_id: "cat-giay",
  },
  {
    id: "cat-giay-nhiet",
    name: "Giấy in nhiệt",
    slug: "giay-in-nhiet",
    description: "Giấy nhiệt POS, fax, bill",
    sort: 8,
    image_url: "/products/giay-a4-ream-01.jpg",
    parent_id: "cat-giay",
  },
  {
    id: "cat-giay-bia-mau",
    name: "Giấy bìa, Ford màu",
    slug: "giay-bia-ford-mau",
    description: "Bìa màu A3/A4, giấy Ford, ép plastic",
    sort: 9,
    image_url: "/products/bia-ho-so.jpg",
    parent_id: "cat-giay",
  },
  {
    id: "cat-giay-than",
    name: "Giấy than, niêm phong",
    slug: "giay-than-niem-phong",
    description: "Giấy than, giấy niêm phong",
    sort: 10,
    image_url: "/products/giay-a4-ream-01.jpg",
    parent_id: "cat-giay",
  },
  {
    id: "cat-but",
    name: "Bút & Dụng cụ viết",
    slug: "but-dung-cu-viet",
    description: "Bút bi, gel, dụng cụ viết vẽ",
    sort: 2,
    image_url: "/products/but-bi.jpg",
    parent_id: null,
  },
  {
    id: "cat-bia",
    name: "Bìa & Lưu trữ hồ sơ",
    slug: "bia-luu-tru-ho-so",
    description: "Bìa còng, file, cặp tài liệu",
    sort: 3,
    image_url: "/products/bia-ho-so.jpg",
    parent_id: null,
  },
  {
    id: "cat-muc",
    name: "Mực in & Thiết bị VP",
    slug: "muc-in-thiet-bi-vp",
    description: "Mực in, máy văn phòng nhỏ",
    sort: 4,
    image_url: "/products/muc-in.jpg",
    parent_id: null,
  },
  {
    id: "cat-hs",
    name: "Dụng cụ HS & Nhu yếu phẩm",
    slug: "dung-cu-hs-nhu-yeu-pham",
    description: "Kéo, hồ, đồ dùng học sinh",
    sort: 5,
    image_url: "/products/dung-cu-vp.jpg",
    parent_id: null,
  },
];

const now = new Date();
const flashStart = new Date(now.getTime() - 86400000).toISOString();
const flashEnd = new Date(now.getTime() + 7 * 86400000).toISOString();

export const seedBanners: Banner[] = [
  {
    id: "ban-khai-truong",
    title: "Mừng khai trương VPPACA",
    image_url: "/banners/khai-truong-vppaca.svg",
    link_url: "/gioi-thieu",
    sort: 1,
    starts_at: null,
    ends_at: null,
    is_active: true,
    placement: "home_carousel",
  },
  {
    id: "ban-giam-gia",
    title: "Flash Sale — Giảm đến 30%",
    image_url: "/banners/giam-gia-flash.svg",
    link_url: "/san-pham?sale=1",
    sort: 2,
    starts_at: flashStart,
    ends_at: flashEnd,
    is_active: true,
    placement: "home_carousel",
  },
  {
    id: "ban-dich-vu-moi",
    title: "Dịch vụ mới — B2B Excel & VAT",
    image_url: "/banners/dich-vu-moi-b2b.svg",
    link_url: "/bao-gia-doanh-nghiep",
    sort: 3,
    starts_at: null,
    ends_at: null,
    is_active: true,
    placement: "home_carousel",
  },
  {
    id: "ban-strip-khai-truong",
    title: "🎉 Khai trương vppaca.vn",
    image_url: "/banners/khai-truong-vppaca.svg",
    link_url: "/gioi-thieu",
    sort: 1,
    starts_at: null,
    ends_at: null,
    is_active: true,
    placement: "home_strip",
  },
  {
    id: "ban-strip-sale",
    title: "Flash Sale −30%",
    image_url: "/banners/giam-gia-flash.svg",
    link_url: "/san-pham?sale=1",
    sort: 2,
    starts_at: flashStart,
    ends_at: flashEnd,
    is_active: true,
    placement: "home_strip",
  },
  {
    id: "ban-strip-b2b",
    title: "Báo giá B2B Excel",
    image_url: "/banners/dich-vu-moi-b2b.svg",
    link_url: "/bao-gia-doanh-nghiep",
    sort: 3,
    starts_at: null,
    ends_at: null,
    is_active: true,
    placement: "home_strip",
  },
];

export const seedPromotions: Promotion[] = [
  {
    id: "promo-flash",
    name: "Flash Sale VPP",
    slug: "flash-sale-vpp",
    type: "flash_sale",
    discount_type: "percent",
    discount_value: 10,
    starts_at: flashStart,
    ends_at: flashEnd,
    is_active: true,
  },
];

const VPP_PHOTOS = {
  giay1: "/products/giay-a4-ream-01.jpg",
  giay2: "/products/giay-a4-ream-02.jpg",
  giayBox: "/products/giay-a4-box.jpg",
  but: "/products/but-bi.jpg",
  bia: "/products/bia-ho-so.jpg",
  muc: "/products/muc-in.jpg",
  dungCu: "/products/dung-cu-vp.jpg",
  vo: "/products/vo-so.jpg",
} as const;

const CATEGORY_PHOTO: Record<string, string> = {
  "cat-giay": VPP_PHOTOS.giay1,
  "cat-but": VPP_PHOTOS.but,
  "cat-bia": VPP_PHOTOS.bia,
  "cat-muc": VPP_PHOTOS.muc,
  "cat-hs": VPP_PHOTOS.dungCu,
};

type RawP = Omit<Product, "images"> & {
  imagePaths?: string[];
  imageIndex?: number;
};

function defaultImages(p: RawP): string[] {
  if (p.imagePaths?.length) return p.imagePaths;
  const catImg = CATEGORY_PHOTO[p.category_id];
  if (catImg) return [catImg];
  const i = ((p.imageIndex ?? 1) - 1) % 7;
  return [Object.values(VPP_PHOTOS)[i] ?? VPP_PHOTOS.giay1];
}

const rawProducts: RawP[] = [
  {
    id: "p-giay-a4-80",
    sku: "GIAY-A4-80-DOUBLEA",
    name: "Giấy in A4 Double A 80gsm",
    slug: "giay-in-a4-double-a-80gsm",
    price: 65000,
    sale_price: 62000,
    description: "Giấy in A4 80gsm chất lượng cao, chạy máy mượt.",
    specs: { "Khổ giấy": "A4", "Định lượng": "80gsm", "Thương hiệu": "Double A" },
    category_id: "cat-giay-a4",
    stock: 500,
    sold_count: 1280,
    is_published: true,
    is_featured: true,
    seo_title: "Giấy A4 80gsm Double A | VPPACA",
    seo_description: "Mua giấy A4 80gsm giá tốt — ram, thùng sỉ.",
    brand: "Double A",
    base_uom_code: "ram",
    min_stock: 50,
    filter_attrs: { kho: "A4", gsm: "80", thuong_hieu: "Double A" },
    imagePaths: [VPP_PHOTOS.giay1, VPP_PHOTOS.giayBox],
    detail_description:
      "<p>Ram 500 tờ, khổ A4, 80gsm — chạy laser/photocopy ổn định. Thùng 5 ram (B2B).</p>",
  },
  {
    id: "p-giay-a4-70-excel",
    sku: "GIAY-A4-70-EXCEL",
    name: "Giấy in A4 Excel 70gsm",
    slug: "giay-in-a4-excel-70gsm",
    price: 52000,
    sale_price: 49000,
    description: "Giấy A4 70gsm Excel — cân bằng giá/chất lượng, phù hợp văn phòng & trường học.",
    detail_description:
      "<p>500 tờ/ram · 70gsm · trắng sáng · in/photocopy mượt. Giá sỉ từ 10 lốc.</p>",
    specs: { "Khổ giấy": "A4", "Định lượng": "70gsm", "Thương hiệu": "Excel", "Quy cách": "500 tờ/ram" },
    category_id: "cat-giay-a4",
    stock: 800,
    sold_count: 2100,
    is_published: true,
    is_featured: true,
    seo_title: "Giấy A4 Excel 70gsm giá sỉ | VPPACA",
    seo_description: "Giấy Excel A4 70gsm — ram, thùng, giao nhanh.",
    brand: "Excel",
    base_uom_code: "ram",
    min_stock: 80,
    filter_attrs: { kho: "A4", gsm: "70", thuong_hieu: "Excel" },
    imagePaths: [VPP_PHOTOS.giay2, VPP_PHOTOS.giayBox],
  },
  {
    id: "p-giay-a4-70-ik",
    sku: "GIAY-A4-70-IK",
    name: "Giấy in A4 IK Plus 70gsm",
    slug: "giay-in-a4-ik-plus-70gsm",
    price: 68000,
    sale_price: 62000,
    description: "Giấy A4 70gsm IK Plus — bột gỗ, chạy máy êm, ít kẹt.",
    detail_description: "<p>70gsm · A4 · 500 tờ/ram. Phù hợp in số lượng lớn.</p>",
    specs: { "Khổ giấy": "A4", "Định lượng": "70gsm", "Thương hiệu": "IK Plus" },
    category_id: "cat-giay-a4",
    stock: 300,
    sold_count: 890,
    is_published: true,
    is_featured: true,
    seo_title: "",
    seo_description: "",
    brand: "IK Plus",
    base_uom_code: "ram",
    min_stock: 40,
    filter_attrs: { kho: "A4", gsm: "70", thuong_hieu: "IK Plus" },
    imagePaths: [VPP_PHOTOS.giay2],
  },
  {
    id: "p-giay-a4-70-paperone",
    sku: "GIAY-A4-70-PAPERONE",
    name: "Giấy in A4 PaperOne 70gsm",
    slug: "giay-in-a4-paperone-70gsm",
    price: 70000,
    sale_price: 64000,
    description: "PaperOne A4 70gsm — dòng giấy mid-range phổ biến doanh nghiệp.",
    detail_description: "",
    specs: { "Khổ giấy": "A4", "Định lượng": "70gsm", "Thương hiệu": "PaperOne" },
    category_id: "cat-giay-a4",
    stock: 400,
    sold_count: 760,
    is_published: true,
    is_featured: false,
    seo_title: "",
    seo_description: "",
    brand: "PaperOne",
    base_uom_code: "ram",
    min_stock: 40,
    filter_attrs: { kho: "A4", gsm: "70", thuong_hieu: "PaperOne" },
    imagePaths: [VPP_PHOTOS.giay1],
  },
  {
    id: "p-giay-a4-70-aone",
    sku: "GIAY-A4-70-AONE",
    name: "Giấy in A4 A-One 70gsm (Việt Nam)",
    slug: "giay-in-a4-a-one-70gsm",
    price: 58000,
    sale_price: null,
    description: "Giấy A4 A-One 70gsm — sản xuất Việt Nam, tiết kiệm chi phí.",
    detail_description: "",
    specs: { "Khổ giấy": "A4", "Định lượng": "70gsm", "Thương hiệu": "A-One", "Xuất xứ": "Việt Nam" },
    category_id: "cat-giay-a4",
    stock: 350,
    sold_count: 540,
    is_published: true,
    is_featured: false,
    seo_title: "",
    seo_description: "",
    brand: "A-One",
    base_uom_code: "ram",
    min_stock: 30,
    filter_attrs: { kho: "A4", gsm: "70", thuong_hieu: "A-One" },
    imagePaths: [VPP_PHOTOS.giayBox],
  },
  {
    id: "p-but-bi-05",
    sku: "BUT-BI-05-XANH",
    name: "Bút bi Thiên Long TL-027 0.5mm — Xanh",
    slug: "but-bi-thien-long-027-xanh",
    price: 3500,
    sale_price: 3000,
    description: "Bút bi 0.5mm ngòi trơn, mực xanh.",
    detail_description: "",
    specs: { "Ngòi bút": "0.5mm", "Màu mực": "Xanh" },
    category_id: "cat-but",
    stock: 2000,
    sold_count: 5400,
    is_published: true,
    is_featured: true,
    seo_title: "",
    seo_description: "",
    brand: "Thiên Long",
    base_uom_code: "cay",
    min_stock: 200,
    filter_attrs: { ngoi: "0.5mm", mau: "Xanh" },
    imagePaths: [VPP_PHOTOS.but],
  },
  {
    id: "p-bia-cong-7",
    sku: "BIA-CONG-7CM",
    name: "Bìa còng 7cm A4",
    slug: "bia-cong-7cm-a4",
    price: 45000,
    sale_price: null,
    description: "Bìa còng 7cm, sức chứa ~500 tờ A4.",
    detail_description: "",
    specs: { "Kích thước còng": "7cm", "Khổ": "A4" },
    category_id: "cat-bia",
    stock: 120,
    sold_count: 340,
    is_published: true,
    is_featured: false,
    seo_title: "",
    seo_description: "",
    brand: "ACA",
    base_uom_code: "cai",
    min_stock: 15,
    filter_attrs: { cong: "7cm" },
    imagePaths: [VPP_PHOTOS.bia],
  },
  {
    id: "p-muc-hp-12a",
    sku: "MUC-HP-12A",
    name: "Hộp mực HP 12A (Q2612A) tương thích",
    slug: "muc-hp-12a-tuong-thich",
    price: 180000,
    sale_price: 165000,
    description: "Mực laser tương thích HP 1010/1020.",
    detail_description: "",
    specs: { "Loại mực": "Laser", "Tương thích": "HP 1010/1020" },
    category_id: "cat-muc",
    stock: 80,
    sold_count: 210,
    is_published: true,
    is_featured: true,
    seo_title: "",
    seo_description: "",
    brand: "ACA",
    base_uom_code: "hop",
    min_stock: 10,
    filter_attrs: { loai: "Laser" },
    imagePaths: [VPP_PHOTOS.muc],
  },
];

const manualPaperSources: RawP[] = [...rawProducts, ...giayA4BrandProducts];

const MANUAL_PAPER_SLUGS = new Set(
  manualPaperSources
    .filter((p) => p.category_id.startsWith("cat-giay"))
    .map((p) => p.slug),
);

const paperFromDocs: RawP[] = (paperCatalog.products as RawP[]).filter(
  (p) => !MANUAL_PAPER_SLUGS.has(p.slug) && !giayA4BrandSuppressSlugs.has(p.slug),
);

function expandProducts(): Product[] {
  const extras: RawP[] = [];
  const cats = ["cat-but", "cat-bia", "cat-muc", "cat-hs"] as const;
  const prefixes = ["VPP", "VP", "HS", "OF", "AC"];
  for (let i = 6; i <= 40; i++) {
    const cat = cats[(i - 6) % cats.length];
    const sku = `${prefixes[i % prefixes.length]}-${String(i).padStart(3, "0")}`;
    extras.push({
      id: `p-gen-${i}`,
      sku,
      name: `Sản phẩm văn phòng phẩm ${sku}`,
      slug: `san-pham-vpp-${sku.toLowerCase()}`,
      price: 10000 + (i % 10) * 5000,
      sale_price: i % 3 === 0 ? 8000 + (i % 10) * 4500 : null,
      description: "Hàng chính hãng, giao nhanh.",
      detail_description: "",
      specs: { "Thương hiệu": "ACA Partner" },
      category_id: cat,
      stock: 50 + (i % 20) * 10,
      sold_count: i * 17,
      is_published: true,
      is_featured: i % 5 === 0,
      seo_title: "",
      seo_description: "",
      brand: "ACA Partner",
      base_uom_code: cat === "cat-but" ? "cay" : "cai",
      min_stock: 5,
      filter_attrs: {},
      imageIndex: i,
    });
  }
  return [...manualPaperSources, ...paperFromDocs, ...extras].map((p) => {
    const brandImages =
      p.category_id === "cat-giay-a4" ? resolveGiayA4BrandImages(p) : null;
    return {
      ...p,
      images: brandImages ?? defaultImages(p),
    };
  });
}

export const seedProducts: Product[] = expandProducts();

export const seedUoms: ProductUom[] = [];
export const seedTiers: ProductPriceTier[] = [];

for (const p of seedProducts) {
  if (p.base_uom_code === "ram") {
    seedUoms.push(
      {
        id: `uom-${p.id}-ram`,
        product_id: p.id,
        code: "ram",
        label_vi: "Ram",
        factor_to_base: 1,
        is_default_b2c: true,
        is_default_b2b: false,
        barcode: "",
        sort: 1,
      },
      {
        id: `uom-${p.id}-thung`,
        product_id: p.id,
        code: "thung",
        label_vi: "Thùng (5 ram)",
        factor_to_base: 5,
        is_default_b2c: false,
        is_default_b2b: true,
        barcode: "",
        sort: 2,
      },
    );
    seedTiers.push(
      {
        id: `tier-${p.id}-ram-1`,
        product_id: p.id,
        uom_code: "ram",
        min_qty: 1,
        max_qty: 9,
        unit_price: p.sale_price ?? p.price,
      },
      {
        id: `tier-${p.id}-ram-10`,
        product_id: p.id,
        uom_code: "ram",
        min_qty: 10,
        max_qty: 49,
        unit_price: Math.round((p.sale_price ?? p.price) * 0.95),
      },
      {
        id: `tier-${p.id}-ram-50`,
        product_id: p.id,
        uom_code: "ram",
        min_qty: 50,
        max_qty: null,
        unit_price: Math.round((p.sale_price ?? p.price) * 0.9),
      },
    );
  } else if (p.base_uom_code === "cay") {
    seedUoms.push(
      {
        id: `uom-${p.id}-cay`,
        product_id: p.id,
        code: "cay",
        label_vi: "Cây",
        factor_to_base: 1,
        is_default_b2c: true,
        is_default_b2b: false,
        barcode: "",
        sort: 1,
      },
      {
        id: `uom-${p.id}-hop`,
        product_id: p.id,
        code: "hop",
        label_vi: "Hộp (12 cây)",
        factor_to_base: 12,
        is_default_b2c: false,
        is_default_b2b: true,
        barcode: "",
        sort: 2,
      },
    );
    seedTiers.push({
      id: `tier-${p.id}-hop-1`,
      product_id: p.id,
      uom_code: "hop",
      min_qty: 1,
      max_qty: null,
      unit_price: Math.round((p.sale_price ?? p.price) * 12 * 0.88),
    });
  } else {
    seedUoms.push({
      id: `uom-${p.id}-cai`,
      product_id: p.id,
      code: "cai",
      label_vi: "Cái",
      factor_to_base: 1,
      is_default_b2c: true,
      is_default_b2b: true,
      barcode: "",
      sort: 1,
    });
  }
}

export const seedPromotionProducts: PromotionProduct[] = seedProducts
  .filter((p) => p.is_featured)
  .slice(0, 8)
  .map((p, idx) => ({
    id: `pp-flash-${idx}`,
    promotion_id: "promo-flash",
    product_id: p.id,
    sale_price: Math.round((p.sale_price ?? p.price) * 0.9),
  }));

export const seedArticles = [] as import("@/lib/types").HealthArticle[];
