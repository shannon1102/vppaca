-- Banner trang chủ PNG (Giấy A4, Dụng cụ học tập, VPP)
insert into public.banners (id, title, image_url, link_url, sort, starts_at, ends_at, is_active, placement)
values
  (
    'ban-giay-a4-hero',
    'Giấy A4 từ các thương hiệu hàng đầu',
    '/banners/giay-a4-thuong-hieu.png',
    '/danh-muc/giay-a4',
    1,
    null,
    null,
    true,
    'home_carousel'
  ),
  (
    'ban-dung-cu-hoc-tap',
    'Sẵn sàng cho năm học mới',
    '/banners/dung-cu-hoc-tap-nam-hoc-moi.png',
    '/danh-muc/dung-cu-hs-nhu-yeu-pham',
    2,
    null,
    null,
    true,
    'home_carousel'
  ),
  (
    'ban-van-phong-pham',
    'Làm việc gọn gàng, hiệu quả mỗi ngày',
    '/banners/van-phong-pham-lam-viec.png',
    '/san-pham',
    3,
    null,
    null,
    true,
    'home_carousel'
  ),
  (
    'ban-strip-giay-a4',
    'Giấy A4 — Double A, IK, PaperOne…',
    '/banners/giay-a4-thuong-hieu.png',
    '/danh-muc/giay-a4',
    1,
    null,
    null,
    true,
    'home_strip'
  ),
  (
    'ban-strip-hoc-tap',
    'Dụng cụ học tập — ưu đãi mùa tựu trường',
    '/banners/dung-cu-hoc-tap-nam-hoc-moi.png',
    '/danh-muc/dung-cu-hs-nhu-yeu-pham',
    2,
    null,
    null,
    true,
    'home_strip'
  ),
  (
    'ban-strip-vpp',
    'Văn phòng phẩm — giao nhanh, xuất VAT',
    '/banners/van-phong-pham-lam-viec.png',
    '/san-pham',
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
where id in (
  'ban-khai-truong',
  'ban-giam-gia',
  'ban-dich-vu-moi',
  'ban-strip-khai-truong',
  'ban-strip-sale',
  'ban-strip-b2b',
  'ban-1',
  'ban-2',
  'ban-3'
);
