-- Medical Store Web — schema (text ids for white-label seed compatibility)
create extension if not exists "pgcrypto";

create table if not exists public.categories (
  id text primary key,
  name text not null,
  slug text not null unique,
  description text not null default '',
  sort int not null default 0,
  image_url text
);

create table if not exists public.products (
  id text primary key,
  name text not null,
  slug text not null unique,
  sku text not null unique,
  price numeric not null,
  sale_price numeric,
  description text not null default '',
  specs jsonb not null default '{}'::jsonb,
  category_id text references public.categories(id) on delete set null,
  images text[] not null default '{}',
  stock int not null default 0,
  is_published boolean not null default false,
  is_featured boolean not null default false,
  seo_title text not null default '',
  seo_description text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists public.orders (
  id text primary key,
  code text not null unique,
  customer_name text not null,
  customer_phone text not null,
  customer_email text not null default '',
  customer_address text not null,
  note text not null default '',
  status text not null default 'pending'
    check (status in ('pending','confirmed','paid','shipped','cancelled')),
  total numeric not null,
  created_at timestamptz not null default now()
);

create table if not exists public.order_items (
  id text primary key,
  order_id text not null references public.orders(id) on delete cascade,
  product_id text,
  name text not null,
  qty int not null,
  unit_price numeric not null
);

create table if not exists public.site_settings (
  id uuid primary key default gen_random_uuid(),
  shop_name text not null,
  tagline text not null default '',
  phone text not null default '',
  email text not null default '',
  address text not null default '',
  logo_url text not null default '',
  favicon_url text not null default '',
  primary_color text not null default '#0F766E',
  secondary_color text not null default '#134E4A',
  accent_color text not null default '#F59E0B',
  bank_name text not null default '',
  bank_account text not null default '',
  bank_holder text not null default '',
  transfer_content_template text not null default 'DH {code}',
  qr_image_url text not null default '',
  facebook_url text not null default '',
  zalo_url text not null default ''
);

alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.site_settings enable row level security;

-- Recreate policies idempotently
do $$ begin
  create policy "Public read categories" on public.categories for select using (true);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "Public read published products" on public.products
    for select using (is_published = true or auth.role() = 'authenticated');
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "Public read settings" on public.site_settings for select using (true);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "Public insert orders" on public.orders for insert with check (true);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "Public insert order_items" on public.order_items for insert with check (true);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "Auth manage categories" on public.categories
    for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "Auth manage products" on public.products
    for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "Auth manage orders" on public.orders
    for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "Auth manage order_items" on public.order_items
    for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "Auth manage settings" on public.site_settings
    for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
exception when duplicate_object then null; end $$;

-- Service role bypasses RLS; for anon writes via service key in server actions we use service role.
-- Allow public update settings only via service role (no policy needed for service role).
