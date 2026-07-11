# Deploy — Vercel + Supabase

## Checklist

- [x] Vercel project linked (`medical-store-web`)
- [x] Supabase Marketplace resource `medical-store-db` (Free)
- [x] Migration `supabase/migrations/001_init.sql` applied
- [x] Migration `supabase/migrations/002_health_articles.sql` applied (bài viết sức khỏe)
- [x] Migration `supabase/migrations/003_media_files.sql` applied (upload ảnh rich text)
- [x] Migration `supabase/migrations/004_product_detail_description.sql` applied (mô tả chi tiết sản phẩm)
- [x] Migration `supabase/migrations/005_brand_colors.sql` applied (màu primary #2E7D32)
- [x] Migration `supabase/migrations/006_product_sold_count.sql` applied (đã bán)
- [x] Catalog reset for client handoff (products/orders/articles cleared; categories + settings kept)
- [x] Env: Supabase keys (auto), `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `NEXT_PUBLIC_SITE_URL`
- [x] Health: `/api/health`
- [x] GitHub Actions keep-alive: `.github/workflows/supabase-keepalive.yml`
- [ ] UptimeRobot (optional)
- [x] Custom domain (`thietbiytetamduc.vn` primary, `thietbiytetamduc.com` redirect)

## Commands

```bash
cd medical-store-web
npx vercel --prod
npx vercel env pull .env.local
```

## Rollback

Vercel Dashboard → Deployments → Promote previous production deployment.

## Data

- Production data: Supabase (service role on server)
- Local without keys: `.data/store.json`
- Seed auto-runs once when `products` table empty

## Supabase keep-alive (GitHub Actions)

Workflow `supabase-keepalive.yml` ping DB **2 lần/ngày** (8h & 20h VN) để giảm nguy cơ Supabase Free tier bị pause.

**GitHub repo → Settings → Secrets and variables → Actions**, thêm:

| Secret | Giá trị |
|--------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://xxx.supabase.co` |
| `SUPABASE_SERVICE_ROLE_KEY` | service role key |
| `NEXT_PUBLIC_SITE_URL` | `https://thietbiytetamduc.vn` |

Chạy thử tay: **Actions → Supabase keep-alive → Run workflow**.

> Supabase có thể vẫn pause dù có cron (xem [thảo luận DEV](https://dev.to/jps27cse/how-to-prevent-your-supabase-project-database-from-being-paused-using-github-actions-3hel)). Khi nhận email pause → vào Supabase Dashboard → **Restore project**.
