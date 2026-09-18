# ACA — Brand kit (VPP)

Đồng bộ palette **TechPartner** (`techpartner-website/src/app/globals.css`).

## Màu

| Token | Hex | Dùng |
|-------|-----|------|
| Primary | `#C17A2E` | Nút, nhấn mạnh |
| Primary hover | `#A06524` | Hover, subtitle |
| Amber | `#F5C563` | Gradient sáng |
| Brown deep | `#8B5A2B` | Đáy gradient |
| Cream | `#FDF8F0` | Chữ trên nền cam |
| Muted | `#F5E6D3` | Viền, nền phụ |
| Text | `#1C1917` | Wordmark nền sáng |
| Surface dark | `#0C0A09` | Header/footer tối |

## File logo

| File | Mục đích |
|------|----------|
| `aca-icon.svg` | Favicon, app icon, avatar MXH (512×512) |
| `aca-logo-horizontal.svg` | Website header, hóa đơn, chữ ký email |
| `aca-logo-dark.svg` | Nền tối, banner |

## Web (`vppaca.vn`)

```css
:root {
  --primary: #c17a2e;
  --primary-hover: #a06524;
  --primary-light: #fdf8f0;
  --primary-muted: #f5e6d3;
  --background: #fafaf9;
  --foreground: #1c1917;
}
```

## Quy cách

- Bo góc icon: **96px** trên 512px (~19%) — tương đương `rounded-2xl` / `rounded-xl` TechPartner.
- Không kéo méo; luôn giữ tỷ lệ.
- Khoảng trống tối thiểu quanh icon: **= 10%** chiều cao logo.

## Xuất PNG (tùy chọn)

Mở SVG trong Figma / Inkscape → export `@1x`, `@2x` (512, 1024 icon; 720×160 logo ngang).
