# UI Spec — Medical Store Web (white-label)

## Brand tokens (CSS variables)

| Token | Default | Nguồn |
|-------|---------|--------|
| `--brand-primary` | `#2E7D32` | site_settings.primary_color |
| `--brand-primary-hover` | `#1B5E20` | darker primary (hover) |
| `--brand-secondary` | `#1B4332` | site_settings.secondary_color |
| `--brand-accent` | `#8BC34A` | site_settings.accent_color |
| `--brand-bg` | `#F8FAFC` | fixed / settings |
| `--brand-surface` | `#FFFFFF` | fixed |
| `--brand-text` | `#0F172A` | fixed |
| `--brand-muted` | `#64748B` | fixed |
| `--font-display` | DM Sans | theme |
| `--font-body` | Source Sans 3 | theme |
| `--radius` | `12px` | theme |

Logo / favicon: `logo_url`, `favicon_url` từ settings — không hard-code trong component.

## User flow

Home → Category / Product → Cart → Checkout → Thank you (CK + QR)

## Screens

### Home

- Header sticky: logo, nav (Trang chủ, Sản phẩm, Giới thiệu, Liên hệ), giỏ
- Hero: tên shop + tagline + CTA "Xem sản phẩm" / "Liên hệ"
- Section danh mục (grid)
- Section sản phẩm nổi bật
- Footer: địa chỉ, SĐT, link chính sách

### Category `/san-pham` và `/danh-muc/[slug]`

- Filter danh mục + sort giá
- Grid ProductCard (ảnh 1:1, tên, giá, badge giảm giá)
- Empty / skeleton

### Product detail `/san-pham/[slug]`

- Gallery ảnh, giá, SKU, mô tả, specs table
- CTA "Thêm vào giỏ"
- Related products

### Cart `/gio-hang`

- Line items, qty ±, xóa, tổng
- CTA "Đặt hàng"

### Checkout `/thanh-toan`

- Form: họ tên*, SĐT*, email, địa chỉ*, ghi chú
- Tóm tắt đơn
- Submit → tạo đơn

### Thank you `/dat-hang-thanh-cong/[code]`

- Mã đơn, số TK, chủ TK, ngân hàng
- Nội dung CK (copy)
- QR lớn
- Hướng dẫn: chuyển khoản → shop xác nhận

### Admin

- Login
- Products / Categories / Orders / Branding (logo + màu live) / Bank + QR

## Components

Button (primary, secondary, ghost), Input, ProductCard, Badge, Table, Toast, Skeleton, EmptyState

## Breakpoints

375 / 768 / 1280 — spacing 4px grid

## Copy VI (core)

- CTA giỏ: "Thêm vào giỏ"
- Checkout: "Đặt hàng"
- Thank you: "Vui lòng chuyển khoản theo thông tin bên dưới"
- Empty cart: "Giỏ hàng trống"
