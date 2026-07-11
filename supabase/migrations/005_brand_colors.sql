-- Align site_settings brand colors with Tam Đức logo green palette
update public.site_settings
set
  primary_color = '#2E7D32',
  secondary_color = '#1B4332',
  accent_color = '#8BC34A'
where primary_color in ('#0F766E', '#0f766e')
   or primary_color is null;

alter table public.site_settings
  alter column primary_color set default '#2E7D32',
  alter column secondary_color set default '#1B4332',
  alter column accent_color set default '#8BC34A';
