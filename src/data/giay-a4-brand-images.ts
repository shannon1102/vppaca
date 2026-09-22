/**
 * Ảnh sản phẩm thật theo thương hiệu (public/products/brands/).
 * Áp dụng cho mọi SKU thuộc cat-giay-a4 thay cho giay-a4-ream-*.jpg mặc định.
 */

const B = "/products/brands";

/** Ưu tiên slug cụ thể (variant Office, Eco, …). */
const SLUG_IMAGES: Record<string, string[]> = {
  "giay-in-a4-bai-bang-office-70gsm": [
    `${B}/bai-bang-office-a4-70gsm-ream.jpg`,
    `${B}/bai-bang-office-a4-70gsm-alt.jpg`,
  ],
  "giay-in-a4-bai-bang-copy-60gsm": [
    `${B}/bai-bang-office-a4-70gsm-ream.jpg`,
    `${B}/bai-bang-office-a4-70gsm-alt.jpg`,
  ],
  "giay-in-a4-bai-bang-70gsm": [
    `${B}/bai-bang-office-a4-70gsm-ream.jpg`,
    `${B}/bai-bang-office-a4-70gsm-alt.jpg`,
  ],
  "giay-in-a4-bai-bang-classic-70gsm": [
    `${B}/bai-bang-office-a4-70gsm-alt.jpg`,
    `${B}/bai-bang-office-a4-70gsm-ream.jpg`,
  ],
  "giay-in-a4-clever-up-eco-70gsm": [
    `${B}/clever-up-a4-70gsm-ream-green.jpg`,
    `${B}/clever-up-a4-70gsm-ream-grey.jpg`,
  ],
  "giay-in-a4-clever-up-70gsm": [
    `${B}/clever-up-a4-70gsm-ream-green.jpg`,
    `${B}/clever-up-a4-70gsm-ream-grey.jpg`,
  ],
  "giay-in-a4-clever-up-65gsm": [`${B}/clever-up-a4-70gsm-ream-grey.jpg`],
  "giay-in-a4-clever-up-80gsm": [`${B}/clever-up-a4-70gsm-ream-green.jpg`],
  "giay-in-a4-idea-max-70gsm": [
    `${B}/idea-max-a4-70gsm-ream.jpg`,
    `${B}/idea-max-a4-70gsm-set.jpg`,
    `${B}/idea-max-a4-70gsm-carton.jpg`,
  ],
  "giay-a4-idea-70gsm": [
    `${B}/idea-max-a4-70gsm-ream.jpg`,
    `${B}/idea-max-a4-70gsm-set-scgp.jpg`,
  ],
  "giay-in-a4-ik-one-70gsm": [
    `${B}/ik-copy-a4-70gsm-carton.jpg`,
    `${B}/ik-plus-a4-70gsm-ream.jpg`,
  ],
  "giay-in-a4-ik-yellow-70gsm": [
    `${B}/ik-plus-a4-70gsm-stack.jpg`,
    `${B}/ik-plus-a4-70gsm-ream.jpg`,
  ],
  "giay-ik-natural-a4-70gsm": [
    `${B}/ik-plus-a4-70gsm-ream.jpg`,
    `${B}/ik-plus-a4-70gsm-set.jpg`,
  ],
  "giay-a4-natural-70": [
    `${B}/ik-plus-a4-70gsm-ream.jpg`,
    `${B}/ik-plus-a4-70gsm-set.jpg`,
  ],
  "giay-a4-ik-copy-70gsm": [`${B}/ik-copy-a4-70gsm-carton.jpg`, `${B}/ik-plus-a4-70gsm-ream.jpg`],
  "giay-in-a4-ik-plus-70gsm": [
    `${B}/ik-plus-a4-70gsm-ream.jpg`,
    `${B}/ik-plus-a4-70gsm-set.jpg`,
    `${B}/ik-plus-a4-70gsm-stack.jpg`,
  ],
  "giay-in-a4-ik-plus-80gsm": [
    `${B}/ik-plus-a4-70gsm-set.jpg`,
    `${B}/ik-plus-a4-70gsm-ream.jpg`,
  ],
  "giay-in-a4-paperone-70gsm": [
    `${B}/paperone-a4-70gsm-copier-ream.jpg`,
    `${B}/paperone-a4-70gsm-premium-set.jpg`,
    `${B}/paperone-a4-70gsm-carton.jpg`,
  ],
  "giay-a4-paper-one-70-gsm": [
    `${B}/paperone-a4-70gsm-copier-ream.jpg`,
    `${B}/paperone-a4-70gsm-carton.jpg`,
  ],
  "giay-a4-paper-one-80-gsm": [
    `${B}/paperone-a4-70gsm-premium-set.jpg`,
    `${B}/paperone-a4-70gsm-carton.jpg`,
  ],
  "giay-in-a4-double-a-80gsm": [
    `${B}/double-a-a4-premium-ream.jpg`,
    `${B}/double-a-a4-70gsm-everyday-ream.jpg`,
  ],
  "giay-a4-double-a-80-gsm": [
    `${B}/double-a-a4-premium-ream.jpg`,
    `${B}/double-a-a4-70gsm-carton.jpg`,
  ],
  "giay-double-a-a4-70-gsm": [
    `${B}/double-a-a4-70gsm-everyday-ream.jpg`,
    `${B}/double-a-a4-70gsm-carton.jpg`,
  ],
  "giay-a4-quality-70gsm": [
    `${B}/quality-a4-70gsm-ream.jpg`,
    `${B}/quality-a4-70gsm-set.jpg`,
    `${B}/quality-a4-70gsm-carton.jpg`,
  ],
  "giay-a4-supreme-70-gsm": [`${B}/supreme-a4-70gsm-set.jpg`],
  "giay-smartist-a4-70gsm": [`${B}/quality-a4-70gsm-ream.jpg`],
};

type BrandRule = { keys: string[]; gsm?: string; images: string[] };

/** Khớp thương hiệu + định lượng (gsm). */
const BRAND_RULES: BrandRule[] = [
  {
    keys: ["clever up", "cleverup"],
    images: [`${B}/clever-up-a4-70gsm-ream-green.jpg`, `${B}/clever-up-a4-70gsm-ream-grey.jpg`],
  },
  {
    keys: ["bãi bằng", "bai bang", "baibang"],
    images: [`${B}/bai-bang-office-a4-70gsm-ream.jpg`, `${B}/bai-bang-office-a4-70gsm-alt.jpg`],
  },
  {
    keys: ["idea max", "idea"],
    gsm: "70",
    images: [`${B}/idea-max-a4-70gsm-ream.jpg`, `${B}/idea-max-a4-70gsm-set.jpg`],
  },
  {
    keys: ["paperone", "paper one"],
    gsm: "80",
    images: [`${B}/paperone-a4-70gsm-premium-set.jpg`, `${B}/paperone-a4-70gsm-carton.jpg`],
  },
  {
    keys: ["paperone", "paper one"],
    images: [
      `${B}/paperone-a4-70gsm-copier-ream.jpg`,
      `${B}/paperone-a4-70gsm-premium-set.jpg`,
      `${B}/paperone-a4-70gsm-carton.jpg`,
    ],
  },
  {
    keys: ["double a"],
    gsm: "80",
    images: [`${B}/double-a-a4-premium-ream.jpg`, `${B}/double-a-a4-70gsm-carton.jpg`],
  },
  {
    keys: ["double a"],
    images: [`${B}/double-a-a4-70gsm-everyday-ream.jpg`, `${B}/double-a-a4-70gsm-carton.jpg`],
  },
  {
    keys: ["ik plus"],
    gsm: "80",
    images: [`${B}/ik-plus-a4-70gsm-set.jpg`, `${B}/ik-plus-a4-70gsm-ream.jpg`],
  },
  {
    keys: ["ik plus", "ik one", "ik yellow", "ik natural", "ik copy"],
    images: [
      `${B}/ik-plus-a4-70gsm-ream.jpg`,
      `${B}/ik-plus-a4-70gsm-set.jpg`,
      `${B}/ik-copy-a4-70gsm-carton.jpg`,
    ],
  },
  {
    keys: ["quality"],
    images: [`${B}/quality-a4-70gsm-ream.jpg`, `${B}/quality-a4-70gsm-set.jpg`, `${B}/quality-a4-70gsm-carton.jpg`],
  },
  {
    keys: ["supreme"],
    images: [`${B}/supreme-a4-70gsm-set.jpg`],
  },
];

function norm(s: string): string {
  return s
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

function productGsm(p: {
  filter_attrs?: Record<string, string>;
  specs?: Record<string, string>;
  name?: string;
}): string {
  const raw =
    p.filter_attrs?.gsm ??
    p.specs?.["Định lượng"]?.match(/\d+/)?.[0] ??
    p.name?.match(/(\d+)\s*gsm/i)?.[1] ??
    "";
  return raw.replace(/\D/g, "");
}

function productBrand(p: {
  brand?: string;
  filter_attrs?: Record<string, string>;
  specs?: Record<string, string>;
  name?: string;
}): string {
  return norm(
    p.brand ||
      p.filter_attrs?.thuong_hieu ||
      p.specs?.["Thương hiệu"] ||
      p.name?.split(/\s+/).slice(0, 3).join(" ") ||
      "",
  );
}

export function resolveGiayA4BrandImages(p: {
  slug?: string;
  brand?: string;
  filter_attrs?: Record<string, string>;
  specs?: Record<string, string>;
  name?: string;
}): string[] | null {
  if (p.slug && SLUG_IMAGES[p.slug]) {
    return [...SLUG_IMAGES[p.slug]];
  }

  const name = norm(p.name || "");
  if (name.includes("ik natural") || name.includes("natural 70")) {
    return [`${B}/ik-plus-a4-70gsm-ream.jpg`, `${B}/ik-plus-a4-70gsm-set.jpg`];
  }
  if (name.includes("ik copy")) {
    return [`${B}/ik-copy-a4-70gsm-carton.jpg`, `${B}/ik-plus-a4-70gsm-ream.jpg`];
  }

  const brand = productBrand(p);
  const gsm = productGsm(p);
  if (!brand) return null;

  for (const rule of BRAND_RULES) {
    const keyHit = rule.keys.some((k) => brand.includes(norm(k)));
    if (!keyHit) continue;
    if (rule.gsm && rule.gsm !== gsm) continue;
    return [...rule.images];
  }

  return null;
}

/** Ảnh đại diện danh mục Giấy A4 trên menu / banner. */
export const GIAY_A4_CATEGORY_HERO = `${B}/double-a-a4-70gsm-everyday-ream.jpg`;
