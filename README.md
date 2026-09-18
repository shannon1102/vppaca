# VPPACA — vppaca.vn

E-commerce văn phòng phẩm B2B/B2C: Next.js 16 + Supabase.

## Quick start

```bash
cp .env.example .env.local
npm install
npm run dev
```

- Storefront: http://localhost:3000  
- Admin: http://localhost:3000/admin/login (env `ADMIN_EMAIL` / `ADMIN_PASSWORD`)

Không cấu hình Supabase: dữ liệu demo trong `.data/store.json` + `vpp.json`.

## Tính năng Giai đoạn 1

- Multi-UoM (ram/thùng, cây/hộp) + giá bậc theo số lượng
- UI kiểu Shopee: banner, flash sale, grid SP
- Checkout VAT + VietQR
- Báo giá B2B: upload Excel, ghép SKU
- Admin API + export CSV kế toán / catalog sàn
- White-label từ [medical-store-web](https://github.com/shannon1102/medical-store-web)

## Docs

- [docs/deploy.md](docs/deploy.md)
- [docs/admin-api.md](docs/admin-api.md)
