export type OrderStatus =
  | "pending"
  | "confirmed"
  | "paid"
  | "shipped"
  | "cancelled";

export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string;
  sort: number;
  image_url: string | null;
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
};

export type OrderItem = {
  id: string;
  order_id: string;
  product_id: string;
  name: string;
  qty: number;
  unit_price: number;
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
};

export type CartItem = {
  productId: string;
  name: string;
  slug: string;
  image: string;
  price: number;
  qty: number;
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
