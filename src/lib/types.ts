export type OrderStatus =
  | "pending"
  | "confirmed"
  | "paid"
  | "shipped"
  | "cancelled";

export type CustomerType = "b2c" | "b2b";

export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string;
  sort: number;
  image_url: string | null;
  parent_id?: string | null;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  sku: string;
  price: number;
  sale_price: number | null;
  description: string;
  detail_description: string;
  specs: Record<string, string>;
  category_id: string;
  images: string[];
  stock: number;
  sold_count: number;
  is_published: boolean;
  is_featured: boolean;
  seo_title: string;
  seo_description: string;
  brand: string;
  base_uom_code: string;
  min_stock: number;
  filter_attrs: Record<string, string>;
};

export type ProductUom = {
  id: string;
  product_id: string;
  code: string;
  label_vi: string;
  factor_to_base: number;
  is_default_b2c: boolean;
  is_default_b2b: boolean;
  barcode: string;
  sort: number;
};

export type ProductPriceTier = {
  id: string;
  product_id: string;
  uom_code: string;
  min_qty: number;
  max_qty: number | null;
  unit_price: number;
};

export type ProductCatalog = Product & {
  uoms: ProductUom[];
  tiers: ProductPriceTier[];
};

export type Banner = {
  id: string;
  title: string;
  image_url: string;
  link_url: string;
  sort: number;
  starts_at: string | null;
  ends_at: string | null;
  is_active: boolean;
  placement: string;
};

export type Promotion = {
  id: string;
  name: string;
  slug: string;
  type: "flash_sale" | "category_sale" | "shop_wide";
  discount_type: "percent" | "fixed";
  discount_value: number;
  starts_at: string;
  ends_at: string;
  is_active: boolean;
};

export type PromotionProduct = {
  id: string;
  promotion_id: string;
  product_id: string;
  sale_price: number | null;
};

export type RfqStatus = "draft" | "submitted" | "quoted" | "closed";

export type RfqRequest = {
  id: string;
  company_name: string;
  contact_name: string;
  contact_phone: string;
  contact_email: string;
  note: string;
  status: RfqStatus;
  source: "cart" | "excel";
  excel_path: string;
  created_at: string;
  items?: RfqItem[];
};

export type RfqItem = {
  id: string;
  rfq_id: string;
  sku: string;
  product_id: string | null;
  qty: number;
  uom_code: string;
  matched: boolean;
  note: string;
};

export type SiteSettings = {
  id: string;
  shop_name: string;
  tagline: string;
  phone: string;
  email: string;
  address: string;
  logo_url: string;
  favicon_url: string;
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  bank_name: string;
  bank_account: string;
  bank_holder: string;
  transfer_content_template: string;
  qr_image_url: string;
  facebook_url: string;
  zalo_url: string;
  bank_bin: string;
};

export type OrderItem = {
  id: string;
  order_id: string;
  product_id: string;
  name: string;
  qty: number;
  unit_price: number;
  uom_code: string;
  factor_to_base: number;
  qty_base: number;
  tier_label: string;
};

export type Order = {
  id: string;
  code: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  customer_address: string;
  note: string;
  status: OrderStatus;
  total: number;
  created_at: string;
  items: OrderItem[];
  customer_type: CustomerType;
  payment_method: string;
  need_vat_invoice: boolean;
  vat_company_name: string;
  vat_tax_code: string;
  vat_address: string;
  vat_email: string;
  subtotal: number | null;
  discount_total: number;
  accounting_exported_at: string | null;
};

export type CartItem = {
  productId: string;
  uomCode: string;
  name: string;
  slug: string;
  image: string;
  price: number;
  qty: number;
  factorToBase: number;
  uomLabel: string;
};

export type HealthArticle = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image_url: string | null;
  tags: string[];
  is_published: boolean;
  seo_title: string;
  seo_description: string;
  created_at: string;
  updated_at: string;
};

export type MediaFile = {
  id: string;
  original_name: string;
  filename: string;
  mime_type: string;
  size_bytes: number;
  url: string;
  storage_key: string;
  created_at: string;
};

export type ContactLeadStatus = "new" | "contacted" | "closed";

export type ContactLead = {
  id: string;
  name: string;
  phone: string;
  email: string;
  message: string;
  source: string;
  form_id: string;
  status: ContactLeadStatus;
  created_at: string;
};

export type StockAlert = {
  id: string;
  product_id: string;
  stock_at_alert: number;
  min_stock: number;
  created_at: string;
};
