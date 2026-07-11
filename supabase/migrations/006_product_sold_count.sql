alter table public.products
  add column if not exists sold_count int not null default 0;
