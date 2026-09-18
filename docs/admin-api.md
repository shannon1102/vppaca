# Admin API — VPPACA

Auth: session admin (cookie) hoặc `Authorization: Bearer $ADMIN_API_TOKEN`.

| Method | Path | Mô tả |
|--------|------|--------|
| GET/POST | `/api/admin/products` | Danh sách / tạo SP (+ uoms, tiers) |
| GET/PATCH/DELETE | `/api/admin/products/[id]` | Chi tiết catalog |
| GET | `/api/admin/inventory/low-stock` | Tồn dưới ngưỡng |
| POST | `/api/admin/export/orders-accounting` | CSV kế toán VAT |
| POST | `/api/admin/export/catalog` | CSV catalog sàn |

Public RFQ match: `POST /api/rfq/match` body `{ lines: [{ sku, qty, uom_code? }] }`.
