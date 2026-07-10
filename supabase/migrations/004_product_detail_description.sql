alter table public.products
  add column if not exists detail_description text not null default '';
