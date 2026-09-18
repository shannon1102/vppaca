# Deploy vppaca.vn — Vercel + Supabase

## Checklist

1. Tạo project Supabase `vppaca-db`
2. Chạy migrations `supabase/migrations/001_init.sql` … `010_site_settings_bank_bin.sql`
3. Bucket Storage `media` (public read cho ảnh SP)
4. Vercel project link repo `vppaca`
5. Env production (xem `.env.example`)
6. Domain `vppaca.vn` trỏ Vercel
7. GitHub Actions keep-alive (copy từ medical-store-web)

## Lệnh

```bash
npm install
npm run build
vercel login   # một lần trên máy dev
npx vercel --prod
```

CLI cần đăng nhập Vercel (`vercel login`). Supabase: tạo project trên dashboard, dán URL + service role vào env Vercel, chạy SQL migrations theo thứ tự file trong `supabase/migrations/`.

## Seed catalog

Lần đầu deploy với DB trống: app tự seed `site_settings` + catalog VPP khi có `SUPABASE_SERVICE_ROLE_KEY`.

Local không Supabase: xóa `.data/store.json` và restart `npm run dev`.
