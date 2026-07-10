-- Uploaded media files (rich text images, attachments)
create table if not exists public.media_files (
  id text primary key,
  original_name text not null default '',
  filename text not null,
  mime_type text not null,
  size_bytes int not null default 0,
  url text not null,
  storage_key text not null,
  created_at timestamptz not null default now()
);

alter table public.media_files enable row level security;

do $$ begin
  create policy "Public read media_files" on public.media_files for select using (true);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "Auth manage media_files" on public.media_files
    for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
exception when duplicate_object then null; end $$;

-- Supabase Storage bucket for production uploads
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'media',
  'media',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/gif', 'image/webp']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

do $$ begin
  create policy "Public read media bucket" on storage.objects
    for select using (bucket_id = 'media');
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "Auth upload media bucket" on storage.objects
    for insert with check (bucket_id = 'media' and auth.role() = 'authenticated');
exception when duplicate_object then null; end $$;
