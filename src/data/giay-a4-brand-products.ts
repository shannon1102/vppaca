/**
 * SKU thương hiệu giấy A4 ( khảo sát NPP / phân tầng thị trường ).
 * Bổ sung các dòng chưa có trong crawl Ba Nhất — Clever Up, Bãi Bằng (VinaPACO), IK One/Yellow, Idea Max, Excel 65…
 */

type GiayA4BrandSeed = {
  id: string;
  sku: string;
  name: string;
  slug: string;
  gsm: string;
  brand: string;
  origin: string;
  variant?: string;
  price: number;
  sale_price?: number | null;
  featured?: boolean;
  tier: "kinh-te" | "thuong-hieu-manh";
};

const seeds: GiayA4BrandSeed[] = [
  // Bộ 12 SKU khảo sát NPP (ảnh ChatGPT)
  {
    id: "p-giay-a4-excel-65",
    sku: "GIAY-A4-65-EXCEL",
    name: "Giấy in A4 Excel 65gsm",
    slug: "giay-in-a4-excel-65gsm",
    gsm: "65",
    brand: "Excel",
    origin: "Indonesia",
    price: 48000,
    sale_price: 45000,
    featured: true,
    tier: "kinh-te",
  },
  {
    id: "p-giay-a4-bb-copy-60",
    sku: "GIAY-A4-60-BBCOPY",
    name: "Giấy in A4 Bãi Bằng Copy 60gsm",
    slug: "giay-in-a4-bai-bang-copy-60gsm",
    gsm: "60",
    brand: "Bãi Bằng",
    origin: "Việt Nam",
    variant: "Copy",
    price: 54000,
    sale_price: 52000,
    tier: "kinh-te",
  },
  {
    id: "p-giay-a4-bb-office-70",
    sku: "GIAY-A4-70-BBOFF",
    name: "Giấy in A4 Bãi Bằng Office 70gsm",
    slug: "giay-in-a4-bai-bang-office-70gsm",
    gsm: "70",
    brand: "Bãi Bằng",
    origin: "Việt Nam",
    variant: "Office",
    price: 58000,
    sale_price: 56000,
    featured: true,
    tier: "kinh-te",
  },
  {
    id: "p-giay-a4-clever-eco-70",
    sku: "GIAY-A4-70-CLEECO",
    name: "Giấy in A4 Clever Up Eco 70gsm",
    slug: "giay-in-a4-clever-up-eco-70gsm",
    gsm: "70",
    brand: "Clever Up",
    origin: "Việt Nam",
    variant: "Eco",
    price: 59000,
    sale_price: 57000,
    featured: true,
    tier: "kinh-te",
  },
  {
    id: "p-giay-a4-clever-70",
    sku: "GIAY-A4-70-CLEVER",
    name: "Giấy in A4 Clever Up 70gsm",
    slug: "giay-in-a4-clever-up-70gsm",
    gsm: "70",
    brand: "Clever Up",
    origin: "Việt Nam",
    price: 60000,
    sale_price: 58000,
    featured: true,
    tier: "kinh-te",
  },
  {
    id: "p-giay-a4-ik-one-70",
    sku: "GIAY-A4-70-IKONE",
    name: "Giấy in A4 IK One 70gsm",
    slug: "giay-in-a4-ik-one-70gsm",
    gsm: "70",
    brand: "IK One",
    origin: "Indonesia",
    price: 61000,
    sale_price: 59000,
    tier: "kinh-te",
  },
  {
    id: "p-giay-a4-idea-max-70",
    sku: "GIAY-A4-70-IDMAX",
    name: "Giấy in A4 Idea Max 70gsm",
    slug: "giay-in-a4-idea-max-70gsm",
    gsm: "70",
    brand: "Idea Max",
    origin: "Thái Lan",
    price: 62000,
    sale_price: 60000,
    tier: "kinh-te",
  },
  // Tổng Công ty Giấy Việt Nam — Clever Up / Bãi Bằng (ảnh VinaPACO)
  {
    id: "p-giay-a4-clever-65",
    sku: "GIAY-A4-65-CLEVER",
    name: "Giấy in A4 Clever Up 65gsm",
    slug: "giay-in-a4-clever-up-65gsm",
    gsm: "65",
    brand: "Clever Up",
    origin: "Việt Nam",
    price: 55000,
    sale_price: 53000,
    tier: "kinh-te",
  },
  {
    id: "p-giay-a4-clever-80",
    sku: "GIAY-A4-80-CLEVER",
    name: "Giấy in A4 Clever Up 80gsm",
    slug: "giay-in-a4-clever-up-80gsm",
    gsm: "80",
    brand: "Clever Up",
    origin: "Việt Nam",
    price: 72000,
    sale_price: 69000,
    tier: "kinh-te",
  },
  {
    id: "p-giay-a4-bb-70",
    sku: "GIAY-A4-70-BAIBANG",
    name: "Giấy in A4 Bãi Bằng 70gsm",
    slug: "giay-in-a4-bai-bang-70gsm",
    gsm: "70",
    brand: "Bãi Bằng",
    origin: "Việt Nam",
    price: 57000,
    sale_price: 55000,
    tier: "kinh-te",
  },
  {
    id: "p-giay-a4-bb-classic-70",
    sku: "GIAY-A4-70-BBCLAS",
    name: "Giấy in A4 Bãi Bằng Classic 70gsm",
    slug: "giay-in-a4-bai-bang-classic-70gsm",
    gsm: "70",
    brand: "Bãi Bằng Classic",
    origin: "Việt Nam",
    variant: "Classic",
    price: 59000,
    sale_price: 57000,
    tier: "kinh-te",
  },
  // Tầng 2 — IK Yellow (ảnh phân tầng)
  {
    id: "p-giay-a4-ik-yellow-70",
    sku: "GIAY-A4-70-IKYEL",
    name: "Giấy in A4 IK Yellow 70gsm",
    slug: "giay-in-a4-ik-yellow-70gsm",
    gsm: "70",
    brand: "IK Yellow",
    origin: "Indonesia",
    price: 60000,
    sale_price: 58000,
    tier: "kinh-te",
  },
  // IK Plus 80 — tầng thương hiệu mạnh (bổ sung nếu chỉ có trong nhóm giấy cha)
  {
    id: "p-giay-a4-ik-plus-80",
    sku: "GIAY-A4-80-IKPLUS",
    name: "Giấy in A4 IK Plus 80gsm",
    slug: "giay-in-a4-ik-plus-80gsm",
    gsm: "80",
    brand: "IK Plus",
    origin: "Indonesia",
    price: 82000,
    sale_price: 79000,
    tier: "thuong-hieu-manh",
  },
];

/** Slug sản phẩm crawl cũ — trùng tên/dòng mới, ẩn khỏi seed. */
export const giayA4BrandSuppressSlugs = new Set<string>([
  "giay-a4-bai-bang-vang-60gsm",
  "giay-a4-idea-70gsm",
  "giay-ik-plus-a4-80",
]);

export type RawGiayA4Brand = {
  id: string;
  sku: string;
  name: string;
  slug: string;
  price: number;
  sale_price: number | null;
  description: string;
  detail_description: string;
  specs: Record<string, string>;
  category_id: "cat-giay-a4";
  stock: number;
  sold_count: number;
  is_published: boolean;
  is_featured: boolean;
  seo_title: string;
  seo_description: string;
  brand: string;
  base_uom_code: "ram";
  min_stock: number;
  filter_attrs: Record<string, string>;
  imagePaths: string[];
};

const PHOTOS = [
  "/products/giay-a4-ream-01.jpg",
  "/products/giay-a4-ream-02.jpg",
  "/products/giay-a4-box.jpg",
] as const;

function buildProduct(seed: GiayA4BrandSeed, index: number): RawGiayA4Brand {
  const gsmLabel = `${seed.gsm}gsm`;
  const lineNote = seed.variant ? ` · dòng ${seed.variant}` : "";
  const tierLabel =
    seed.tier === "thuong-hieu-manh"
      ? "Thương hiệu mạnh — phù hợp văn phòng cao cấp."
      : "Giấy kinh tế / phổ thông — dùng hàng ngày cho doanh nghiệp & trường học.";

  const description = `${seed.name} — ${gsmLabel}, xuất xứ ${seed.origin}${lineNote}. ${tierLabel} Quy cách 500 tờ/ram, 5 ram/thùng.`;

  return {
    id: seed.id,
    sku: seed.sku,
    name: seed.name,
    slug: seed.slug,
    price: seed.price,
    sale_price: seed.sale_price ?? null,
    description,
    detail_description: `<p>${seed.brand} A4 ${gsmLabel} · ${seed.origin}. Ram 500 tờ, chạy laser/photocopy ổn định. Báo giá sỉ theo bậc 100 → 500 → 2.000 → 10.000 ram (liên hệ NPP).</p>`,
    specs: {
      "Khổ giấy": "A4",
      "Định lượng": gsmLabel,
      "Thương hiệu": seed.brand,
      "Xuất xứ": seed.origin,
      "Quy cách": "500 tờ/ram · 5 ram/thùng",
      ...(seed.variant ? { "Dòng sản phẩm": seed.variant } : {}),
      "Phân tầng": seed.tier === "thuong-hieu-manh" ? "Thương hiệu mạnh" : "Kinh tế / phổ thông",
    },
    category_id: "cat-giay-a4",
    stock: 200 + (index % 15) * 20,
    sold_count: 120 + index * 37,
    is_published: true,
    is_featured: seed.featured ?? false,
    seo_title: `${seed.name} | Giá sỉ VPPACA`,
    seo_description: description.slice(0, 155),
    brand: seed.brand,
    base_uom_code: "ram",
    min_stock: 30,
    filter_attrs: {
      kho: "A4",
      gsm: seed.gsm,
      thuong_hieu: seed.brand,
      xuat_xu: seed.origin,
      phan_tang: seed.tier,
    },
    imagePaths: [PHOTOS[index % PHOTOS.length], PHOTOS[(index + 1) % PHOTOS.length]],
  };
}

export const giayA4BrandProducts: RawGiayA4Brand[] = seeds.map(buildProduct);
