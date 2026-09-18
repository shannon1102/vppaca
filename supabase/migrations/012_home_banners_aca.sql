-- Thay banner trang chủ: khai trương, giảm giá, dịch vụ mới (VPPACA)
insert into public.banners (id, title, image_url, link_url, sort, starts_at, ends_at, is_active, placement)
values
  (
    'ban-khai-truong',
    'Mừng khai trương VPPACA',
    '/banners/khai-truong-vppaca.svg',
    '/gioi-thieu',
    1,
    null,
    null,
    true,
    'home_carousel'
  ),
  (
    'ban-giam-gia',
    'Flash Sale — Giảm đến 30%',
    '/banners/giam-gia-flash.svg',
    '/san-pham?sale=1',
    2,
    null,
    null,
    true,
    'home_carousel'
  ),
  (
    'ban-dich-vu-moi',
    'Dịch vụ mới — B2B Excel & VAT',
    '/banners/dich-vu-moi-b2b.svg',
    '/bao-gia-doanh-nghiep',
    3,
    null,
    null,
    true,
    'home_carousel'
  ),
  (
    'ban-strip-khai-truong',
    'Khai trương vppaca.vn',
    '/banners/khai-truong-vppaca.svg',
    '/gioi-thieu',
    1,
    null,
    null,
    true,
    'home_strip'
  ),
  (
    'ban-strip-sale',
    'Flash Sale -30%',
    '/banners/giam-gia-flash.svg',
    '/san-pham?sale=1',
    2,
    null,
    null,
    true,
    'home_strip'
  ),
  (
    'ban-strip-b2b',
    'Báo giá B2B Excel',
    '/banners/dich-vu-moi-b2b.svg',
    '/bao-gia-doanh-nghiep',
    3,
    null,
    null,
    true,
    'home_strip'
  )
on conflict (id) do update set
  title = excluded.title,
  image_url = excluded.image_url,
  link_url = excluded.link_url,
  sort = excluded.sort,
  is_active = excluded.is_active,
  placement = excluded.placement;

update public.banners
set is_active = false
where id in ('ban-1', 'ban-2', 'ban-3');
