# Tài liệu sản phẩm (tham chiếu ACA)

Thư mục này chứa **dữ liệu tham chiếu** để lập catalog cho website **VPPACA** (`E:\Workspace\vppaca`), không phải nội dung publish trực tiếp.

## Cấu trúc

| Thư mục / file | Mục đích |
|----------------|----------|
| `reference/banhat/` | JSON/CSV crawl từ [VPP Ba Nhất](https://vanphongphambanhat.com.vn/) |
| `reference/thienlong/` | Ảnh + manifest từ [Thiên Long Shop](https://thienlong.vn/) (script Haravan) |
| `by-category/<slug>/` | `items.json` + từng file `.md` theo sản phẩm |
| `index.json` | Bảng tra nhanh toàn bộ SP (giá, slug, đường dẫn doc) |
| `meta.json` | Lần export gần nhất |

## Tải ảnh tham chiếu (Thiên Long, Haravan)

Shop Haravan/Hstatic (vd. `thienlong.vn`) có API JSON công khai theo collection.

```bash
npm run catalog:images:haravan -- --config scripts/store-image-agent/configs/thienlong-but-viet.json
```

Chi tiết, thêm danh mục và prompt cho Cloud Agent: `scripts/store-image-agent/README.md`.

Ảnh tải về nằm trong `reference/.../images/` (gitignore); manifest `products.json` dùng để map SKU ACA sau này.

## Cập nhật dữ liệu

1. Chạy crawler (project `vppaca-crawler`):

   ```bash
   vppaca-crawl -c configs/banhat.yaml
   ```

2. Copy bản mới vào đây:

   ```bash
   cp vppaca-crawler/data/banhat/latest/products.json docs/products/reference/banhat/
   cp vppaca-crawler/data/banhat/latest/products.csv docs/products/reference/banhat/
   ```

3. Sinh lại tài liệu Markdown:

   ```bash
   python scripts/export-product-docs.py
   ```

## Đưa lên website

- Sinh seed giấy vào catalog: `npm run catalog:paper:generate` → `src/data/vpp-paper-products.generated.json` (được import trong `vpp-catalog.ts`).
- Local: `npm run seed:reset` rồi `npm run dev` để nạp lại `.data/`.
- Supabase đã có SP: dùng `node scripts/reset-catalog.cjs` (xóa SP) hoặc nhập qua **Admin** (`/admin/products`).
- Dùng `aca_category_hint` trong frontmatter file `.md` để chọn `category_id` seed (`cat-giay`, …).
- **Viết lại** mô tả/SEO; không copy nguyên văn từ nguồn tham chiếu.

## Lưu ý

Website đang phát triển tại **`E:\Workspace\vppaca`** (repo này). Đường dẫn `E:\Workspace\vppac` nếu bạn gõ thiếu chữ **a** — cùng một dự án.


# 1) Crawl (project vppaca-crawler)
vppaca-crawl -c configs/banhat.yaml --sync-aca-docs

# 2) Sinh lại .md trong repo website
cd E:/Workspace/vppaca
npm run product-docs:export