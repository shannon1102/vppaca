-- VPPACA — Văn phòng phẩm: UoM, giá bậc, marketing, RFQ, VAT đơn hàng

alter table public.products
  add column if not exists brand text not null default '',
  add column if not exists base_uom_code text not null default 'cai',
  add column if not exists min_stock int not null default 0,
  add column if not exists filter_attrs jsonb not null default '{}'::jsonb;

create table if not exists public.product_uoms (
  id text primary key,
  product_id text not null references public.products(id) on delete cascade,
  code text not null,
  label_vi text not null,
  factor_to_base numeric not null default 1 check (factor_to_base > 0),
  is_default_b2c boolean not null default false,
  is_default_b2b boolean not null default false,
  barcode text not null default '',
  sort int not null default 0,
  unique (product_id, code)
);

create table if not exists public.product_price_tiers (
  id text primary key,
  product_id text not null references public.products(id) on delete cascade,
  uom_code text not null,
  min_qty int not null check (min_qty >= 1),
  max_qty int,
  unit_price numeric not null check (unit_price >= 0),
  unique (product_id, uom_code, min_qty)
);

create table if not exists public.banners (
  id text primary key,
  title text not null default '',
  image_url text not null,
  link_url text not null default '/san-pham',
  sort int not null default 0,
  starts_at timestamptz,
  ends_at timestamptz,
  is_active boolean not null default true,
  placement text not null default 'home_carousel'
);

create table if not exists public.promotions (
  id text primary key,
  name text not null,
  slug text not null unique,
  type text not null default 'flash_sale'
    check (type in ('flash_sale', 'category_sale', 'shop_wide')),
  discount_type text not null default 'percent'
    check (discount_type in ('percent', 'fixed')),
  discount_value numeric not null default 0,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  is_active boolean not null default true
);

create table if not exists public.promotion_products (
  id text primary key,
  promotion_id text not null references public.promotions(id) on delete cascade,
  product_id text not null references public.products(id) on delete cascade,
  sale_price numeric,
  unique (promotion_id, product_id)
);

create table if not exists public.rfq_requests (
  id text primary key,
  company_name text not null default '',
  contact_name text not null,
  contact_phone text not null,
  contact_email text not null default '',
  note text not null default '',
  status text not null default 'submitted'
    check (status in ('draft', 'submitted', 'quoted', 'closed')),
  source text not null default 'cart'
    check (source in ('cart', 'excel')),
  excel_path text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists public.rfq_items (
  id text primary key,
  rfq_id text not null references public.rfq_requests(id) on delete cascade,
  sku text not null default '',
  product_id text references public.products(id) on delete set null,
  qty int not null default 1,
  uom_code text not null default '',
  matched boolean not null default false,
  note text not null default ''
);

create table if not exists public.stock_alerts (
  id uuid primary key default gen_random_uuid(),
  product_id text not null references public.products(id) on delete cascade,
  stock_at_alert int not null,
  min_stock int not null,
  created_at timestamptz not null default now()
);

create table if not exists public.channel_listings (
  id text primary key,
  product_id text not null references public.products(id) on delete cascade,
  channel text not null check (channel in ('shopee', 'tiktok', 'other')),
  external_id text not null default '',
  unique (product_id, channel)
);

alter table public.orders
  add column if not exists customer_type text not null default 'b2c'
    check (customer_type in ('b2c', 'b2b')),
  add column if not exists payment_method text not null default 'bank_transfer',
  add column if not exists need_vat_invoice boolean not null default false,
  add column if not exists vat_company_name text not null default '',
  add column if not exists vat_tax_code text not null default '',
  add column if not exists vat_address text not null default '',
  add column if not exists vat_email text not null default '',
  add column if not exists subtotal numeric,
  add column if not exists discount_total numeric not null default 0,
  add column if not exists accounting_exported_at timestamptz;

alter table public.order_items
  add column if not exists uom_code text not null default '',
  add column if not exists factor_to_base numeric not null default 1,
  add column if not exists qty_base numeric not null default 0,
  add column if not exists tier_label text not null default '';

alter table public.product_uoms enable row level security;
alter table public.product_price_tiers enable row level security;
alter table public.banners enable row level security;
alter table public.promotions enable row level security;
alter table public.promotion_products enable row level security;
alter table public.rfq_requests enable row level security;
alter table public.rfq_items enable row level security;
alter table public.stock_alerts enable row level security;
alter table public.channel_listings enable row level security;

do $$ begin
  create policy "Public read uoms" on public.product_uoms for select using (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "Auth manage uoms" on public.product_uoms
    for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "Public read tiers" on public.product_price_tiers for select using (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "Auth manage tiers" on public.product_price_tiers
    for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "Public read active banners" on public.banners
    for select using (is_active = true or auth.role() = 'authenticated');
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "Auth manage banners" on public.banners
    for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "Public read active promotions" on public.promotions
    for select using (is_active = true or auth.role() = 'authenticated');
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "Auth manage promotions" on public.promotions
    for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "Public read promotion_products" on public.promotion_products for select using (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "Auth manage promotion_products" on public.promotion_products
    for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "Public insert rfq" on public.rfq_requests for insert with check (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "Public insert rfq_items" on public.rfq_items for insert with check (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "Auth manage rfq" on public.rfq_requests
    for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "Auth manage rfq_items" on public.rfq_items
    for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "Auth manage stock_alerts" on public.stock_alerts
    for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "Auth manage channel_listings" on public.channel_listings
    for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
exception when duplicate_object then null; end $$;
