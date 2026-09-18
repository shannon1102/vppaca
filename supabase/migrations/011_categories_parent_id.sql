alter table public.categories
  add column if not exists parent_id text references public.categories(id) on delete set null;

create index if not exists categories_parent_id_idx on public.categories (parent_id);
