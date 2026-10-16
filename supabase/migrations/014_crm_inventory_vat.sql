-- CRM khách hàng, sổ tồn kho, hóa đơn VAT (PDF nội bộ)

alter table public.site_settings
  add column if not exists vat_seller_legal_name text not null default '',
  add column if not exists vat_seller_tax_code text not null default '',
  add column if not exists vat_seller_address text not null default '',
  add column if not exists vat_default_rate numeric not null default 8
    check (vat_default_rate >= 0 and vat_default_rate <= 100),
  add column if not exists vat_prices_include_tax boolean not null default true,
  add column if not exists vat_invoice_series text not null default '1C26TAA',
  add column if not exists vat_invoice_next_number int not null default 1 check (vat_invoice_next_number >= 1);

create table if not exists public.customers (
  id text primary key,
  name text not null,
  phone text not null,
  email text not null default '',
  company text not null default '',
  tax_code text not null default '',
  address text not null default '',
  customer_type text not null default 'b2c'
    check (customer_type in ('b2c', 'b2b')),
  debt_balance numeric not null default 0,
  note text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists customers_phone_norm_idx
  on public.customers (regexp_replace(phone, '\D', '', 'g'));

create table if not exists public.customer_notes (
  id text primary key,
  customer_id text not null references public.customers(id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.stock_movements (
  id text primary key,
  product_id text not null references public.products(id) on delete cascade,
  delta_base numeric not null,
  balance_after numeric not null,
  reason text not null
    check (reason in ('sale', 'adjustment', 'receive', 'return', 'cancel_order')),
  reference_type text not null default '',
  reference_id text not null default '',
  note text not null default '',
  created_at timestamptz not null default now()
);

create index if not exists stock_movements_product_created_idx
  on public.stock_movements (product_id, created_at desc);

create table if not exists public.vat_invoices (
  id text primary key,
  invoice_number text not null unique,
  order_id text not null references public.orders(id) on delete restrict,
  customer_id text references public.customers(id) on delete set null,
  issued_at timestamptz not null default now(),
  vat_rate numeric not null,
  subtotal_ex_vat numeric not null,
  vat_amount numeric not null,
  total_inc_vat numeric not null,
  buyer_name text not null,
  buyer_tax_code text not null default '',
  buyer_address text not null default '',
  buyer_email text not null default '',
  line_items jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.orders
  add column if not exists customer_id text references public.customers(id) on delete set null;

alter table public.customers enable row level security;
alter table public.customer_notes enable row level security;
alter table public.stock_movements enable row level security;
alter table public.vat_invoices enable row level security;

do $$ begin
  create policy "Auth manage customers" on public.customers
    for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "Auth manage customer_notes" on public.customer_notes
    for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "Auth manage stock_movements" on public.stock_movements
    for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "Auth manage vat_invoices" on public.vat_invoices
    for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
exception when duplicate_object then null; end $$;
