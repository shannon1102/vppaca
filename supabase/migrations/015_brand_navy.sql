-- Storefront primary matches the Thiên Long navy used on header, buttons, and footer.
update public.site_settings
set
  primary_color = '#16418F',
  secondary_color = '#0E2F62';

alter table public.site_settings
  alter column primary_color set default '#16418F',
  alter column secondary_color set default '#0E2F62';
