# Agent tải ảnh sản phẩm (Haravan / Hstatic)

Công cụ dòng lệnh trong repo **VPPACA** để **tìm sản phẩm theo danh mục** và **tải ảnh** từ các shop dùng nền tảng Haravan (Haravan/Hstatic), ví dụ [Thiên Long Shop](https://thienlong.vn/) — mục [Bút viết](https://thienlong.vn/collections/but-viet).

Không cần parse HTML: shop expose JSON công khai:

`GET https://{shop}/collections/{handle}/products.json?limit=50&page=1`

## Chạy nhanh (Bút viết — Thiên Long)

```bash
npm run catalog:images:haravan -- --config scripts/store-image-agent/configs/thienlong-but-viet.json
```

Thử không tải file (chỉ liệt kê):

```bash
npm run catalog:images:haravan -- --config scripts/store-image-agent/configs/thienlong-but-viet.json --max-pages 1 --dry-run
```

Kết quả:

| File / thư mục | Nội dung |
|----------------|----------|
| `docs/products/reference/thienlong/but-viet/products.json` | Metadata + URL nguồn + đường dẫn ảnh local |
| `docs/products/reference/thienlong/but-viet/meta.json` | Lần chạy gần nhất |
| `docs/products/reference/thienlong/but-viet/images/` | Ảnh tải về (`{handle}.jpg`) |

## Thêm danh mục / shop khác

1. Tạo file config JSON (xem `configs/thienlong-but-viet.json`).
2. `collectionHandle` = slug sau `/collections/` trên URL shop.
3. Chạy lại lệnh trên với `--config` mới.

Hoặc không dùng config:

```bash
node scripts/store-image-agent/fetch-haravan-images.mjs \
  --url https://thienlong.vn \
  --collection bst-but-bi \
  --out docs/products/reference/thienlong/bst-but-bi
```

Tùy chọn:

- `--all-images` — tải toàn bộ ảnh gallery (mặc định chỉ ảnh đầu).
- `--max-pages N` — giới hạn số trang API (50 SP/trang).
- `--delay-ms 400` — nghỉ giữa các trang API.

## Dùng với Cursor Cloud Agent

Prompt mẫu (tiếng Việt):

> Chạy agent tải ảnh Haravan: config `scripts/store-image-agent/configs/thienlong-but-viet.json`, sau đó báo cáo số sản phẩm và đường dẫn `products.json`. Nếu cần thêm danh mục, tạo config mới trong `scripts/store-image-agent/configs/`.

Agent chỉ cần quyền mạng outbound; không đụng database hay website Next.js.

## Đưa ảnh lên catalog VPPACA

Ảnh trong `docs/products/reference/` là **tham chiếu nội bộ**, giống crawl Ba Nhất. Trước khi publish lên `public/products/`:

1. Kiểm tra **bản quyền / điều khoản** shop nguồn và chính sách Thiên Long (ảnh sản phẩm thường thuộc nhà sản xuất).
2. Ưu tiên ảnh **tự chụp**, **media kit** hoặc **stock có license** (xem `public/products/CREDITS.md`).
3. Gắn `image_url` / `images[]` trong seed hoặc Admin — không copy nguyên mô tả HTML từ nguồn.

## Lưu ý kỹ thuật

- User-Agent: `vppaca-store-image-agent/1.0` — tải nhẹ nhàng, có delay mặc định.
- File đã tồn tại trong `images/` được **bỏ qua** (chạy lại an toàn).
- Shop không phải Haravan: dùng project riêng `vppaca-crawler` (Ba Nhất) hoặc mở rộng script tương tự cho API/ HTML của shop đó.
