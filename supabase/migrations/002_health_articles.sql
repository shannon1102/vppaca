-- Health articles for admin CMS + storefront
create table if not exists public.health_articles (
  id text primary key,
  title text not null,
  slug text not null unique,
  excerpt text not null default '',
  content text not null default '',
  cover_image_url text,
  tags text[] not null default '{}',
  is_published boolean not null default false,
  seo_title text not null default '',
  seo_description text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.health_articles enable row level security;

do $$ begin
  create policy "Public read published articles" on public.health_articles
    for select using (is_published = true or auth.role() = 'authenticated');
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "Auth manage articles" on public.health_articles
    for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
exception when duplicate_object then null; end $$;
