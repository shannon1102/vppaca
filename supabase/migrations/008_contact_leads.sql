-- Contact / registration leads from article embeds and public forms
create table if not exists public.contact_leads (
  id text primary key,
  name text not null,
  phone text not null,
  email text not null default '',
  message text not null default '',
  source text not null default 'website',
  form_id text not null default 'tu-van',
  status text not null default 'new'
    check (status in ('new', 'contacted', 'closed')),
  created_at timestamptz not null default now()
);

alter table public.contact_leads enable row level security;

do $$ begin
  create policy "Public insert contact_leads" on public.contact_leads
    for insert with check (true);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "Auth manage contact_leads" on public.contact_leads
    for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
exception when duplicate_object then null; end $$;
