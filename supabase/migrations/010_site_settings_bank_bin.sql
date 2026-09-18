alter table public.site_settings
  add column if not exists bank_bin text not null default '';
