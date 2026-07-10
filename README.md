# Medical Store Web

White-label storefront bán thiết bị y tế: **Next.js + (optional) Supabase**, giỏ hàng, đặt hàng, thanh toán **chuyển khoản + QR**.

Demo chạy **local JSON store** (`.data/store.json`) — không bắt buộc Supabase để xem 20 sản phẩm mẫu.

## Quick start

```bash
cd medical-store-web
cp .env.example .env.local
npm install
npm run dev
```

- Storefront: http://localhost:3000  
- Admin: http://localhost:3000/admin/login  
  - Email: `admin@medistore.vn`  
  - Password: `admin123`

## Production (đã deploy)

- **URL:** https://medical-store-web.vercel.app  
- **Health:** https://medical-store-web.vercel.app/api/health  
- **Admin:** https://medical-store-web.vercel.app/admin/login  
- Stack: Vercel + Supabase Marketplace (`medical-store-db`)  
- Chi tiết: [`docs/deploy.md`](docs/deploy.md)

### Email thông báo đơn hàng

Khi khách đặt hàng, hệ thống gửi email HTML cho admin (Resend).

1. Tạo API key tại [resend.com](https://resend.com)
2. Thêm env trên Vercel:
   - `RESEND_API_KEY`
   - `ADMIN_NOTIFY_EMAIL` (hoặc dùng `ADMIN_EMAIL`)
   - `EMAIL_FROM` (domain đã verify; lúc đầu dùng `onboarding@resend.dev`)
3. Preview template: `/admin/email-preview`

## Tính năng MVP

- 20 sản phẩm mẫu + ảnh `/public/seed/product-01.svg` … `product-20.svg`
- Danh mục, PDP, giỏ, checkout, trang cảm ơn (CK + QR + copy)
- Admin: sản phẩm, danh mục, đơn hàng, **Branding** (logo/màu/CK/QR)
- SEO: metadata, sitemap, robots, JSON-LD Organization/Product
- Theme qua CSS variables từ `site_settings` (white-label)

## Nhân bản white-label (checklist)

1. Copy repo `medical-store-web` (hoặc clone + remote mới)
2. Tạo `.env.local` + domain mới (`NEXT_PUBLIC_SITE_URL`)
3. Xóa `.data/store.json` (hoặc giữ seed rồi sửa trong Admin)
4. Admin → **Branding + CK/QR**: đổi tên shop, logo URL, màu primary/secondary/accent, QR ngân hàng
5. Deploy (Vercel Pro / VPS) + trỏ domain

Không cần sửa màu trong component — dùng `var(--brand-primary)` …

## Supabase (production)

1. Tạo project Supabase
2. Chạy SQL: [`supabase/migrations/001_init.sql`](supabase/migrations/001_init.sql)
3. Import catalog (seed từ Admin hoặc SQL riêng)
4. Set env + `USE_SUPABASE=true` khi đã nối repository Supabase (hiện MVP dùng local store; client helpers nằm ở `src/lib/supabase/`)

## Vận hành chi phí thấp

| Hạng mục | Ghi chú |
|----------|---------|
| Domain | ~300–800k/năm |
| Supabase Free | Đủ traffic thấp |
| Hosting | Vercel Pro (~$20) hoặc VPS rẻ khi commercial |
| Admin | 1 user |

## QA checklist

- [ ] Home hiện danh mục + sản phẩm nổi bật (có ảnh)
- [ ] `/san-pham` đủ 20 SP
- [ ] Thêm giỏ → đổi SL → checkout → mã đơn + QR/CK
- [ ] Admin đổi primary color + logo → storefront đổi theo
- [ ] SP unpublished không hiện public
- [ ] `/sitemap.xml` và `/robots.txt` OK

## Docs

- UI spec: [`docs/ui-spec.md`](docs/ui-spec.md)
