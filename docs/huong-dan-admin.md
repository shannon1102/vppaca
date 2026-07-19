# Hướng dẫn sử dụng khu vực Quản trị (Admin)

Tài liệu dành cho nhân viên vận hành website **Thiết bị Y tế Tâm Đức**.  
Mọi thao tác quản lý sản phẩm, bài viết, đơn hàng và branding đều thực hiện tại khu vực Admin.

> **Đường dẫn Admin:** `https://thietbiytetamduc.vn/admin`  
> (hoặc domain tương đương đang dùng)

---

## Mục lục

1. [Đăng nhập & đăng xuất](#1-đăng-nhập--đăng-xuất)
2. [Giao diện chung](#2-giao-diện-chung)
3. [Tổng quan (Dashboard)](#3-tổng-quan-dashboard)
4. [Sản phẩm](#4-sản-phẩm)
5. [Bài viết sức khỏe](#5-bài-viết-sức-khỏe)
6. [Danh mục](#6-danh-mục)
7. [Đơn hàng](#7-đơn-hàng)
8. [Branding + CK/QR](#8-branding--ckqr)
9. [Email preview](#9-email-preview)
10. [Lưu ý quan trọng](#10-lưu-ý-quan-trọng)
11. [Checklist thao tác hàng ngày](#11-checklist-thao-tác-hàng-ngày)

---

## Cách chèn ảnh minh họa

Khi có ảnh chụp màn hình, đặt file vào thư mục:

```text
docs/images/admin/
```

Rồi bỏ comment dòng ảnh tương ứng trong từng mục, ví dụ:

```markdown
![Đăng nhập Admin](./images/admin/01-dang-nhap.png)
```

Mỗi mục dưới đây đã có **placeholder** tên file gợi ý.

---

## 1. Đăng nhập & đăng xuất

### 1.1. Đăng nhập

1. Mở trình duyệt, vào `/admin` (hoặc `/admin/login`).
2. Nhập **Email** và **Mật khẩu** do quản trị hệ thống cấp.
3. Bấm **Đăng nhập**.

<!-- Ảnh: 01-dang-nhap.png -->
> 📸 **Chèn ảnh:** Màn hình đăng nhập Admin  
> `docs/images/admin/01-dang-nhap.png`

**Lưu ý bảo mật**

- Sai mật khẩu nhiều lần liên tiếp có thể bị **khóa tạm thời khoảng 15 phút**.
- Phiên đăng nhập duy trì tối đa **7 ngày** (cookie). Hết hạn thì đăng nhập lại.
- Không có form đổi mật khẩu trên website — muốn đổi phải nhờ kỹ thuật cập nhật cấu hình máy chủ.

### 1.2. Đăng xuất

Ở cuối sidebar (máy tính) hoặc thanh dưới (điện thoại), bấm **Đăng xuất**.

<!-- Ảnh: 02-dang-xuat.png -->
> 📸 **Chèn ảnh:** Nút Đăng xuất trên sidebar  
> `docs/images/admin/02-dang-xuat.png`

---

## 2. Giao diện chung

Sau khi đăng nhập, mọi trang Admin dùng cùng một khung:

| Vùng | Mô tả |
|------|--------|
| **Sidebar trái** | Menu điều hướng + tên shop + chữ «Quản trị» |
| **Header** | Dòng «Bảng điều khiển» |
| **Nội dung chính** | Nội dung từng trang |
| **Về cửa hàng** | Mở trang bán hàng (storefront) |

### Menu sidebar

| Mục menu | Đường dẫn | Công dụng |
|----------|-----------|-----------|
| Tổng quan | `/admin` | Thống kê nhanh |
| Sản phẩm | `/admin/products` | Quản lý sản phẩm |
| Bài viết SK | `/admin/articles` | Bài viết sức khỏe |
| Danh mục | `/admin/categories` | Nhóm sản phẩm |
| Đơn hàng | `/admin/orders` | Xử lý đơn khách |
| Branding + CK/QR | `/admin/branding` | Logo, màu, CK/QR |
| Email preview | `/admin/email-preview` | Xem mẫu email đơn mới |

<!-- Ảnh: 03-sidebar.png -->
> 📸 **Chèn ảnh:** Sidebar menu đầy đủ  
> `docs/images/admin/03-sidebar.png`

---

## 3. Tổng quan (Dashboard)

Trang đầu sau đăng nhập. Hiển thị số liệu vận hành và lối tắt.

### 3.1. Các thẻ số liệu

| Thẻ | Ý nghĩa |
|-----|---------|
| **Sản phẩm** | Tổng số SP; dòng phụ: số đã xuất bản |
| **Đơn hàng** | Tổng đơn; dòng phụ: số đơn chờ xử lý |
| **Doanh thu (tất cả)** | Tổng tiền các đơn đã ghi nhận |
| **Bài viết SK** | Tổng bài; dòng phụ: số đã xuất bản |
| **Sắp hết hàng** | Sản phẩm tồn kho ≤ 5 |
| **Đơn tháng này** | Số đơn trong tháng; dòng phụ là doanh thu tháng |

### 3.2. Biểu đồ & trạng thái

- **Doanh thu 7 ngày gần nhất**
- **Đơn hàng theo trạng thái** (Chờ xác nhận, Đã xác nhận, Đã thanh toán, Đã giao, Đã hủy)

### 3.3. Liên kết nhanh

Các nút thường dùng: **Quản lý sản phẩm**, **Thêm sản phẩm**, **Xem đơn hàng**, **Đơn chờ**, **Branding**, **Bài viết sức khỏe**.

<!-- Ảnh: 04-tong-quan.png -->
> 📸 **Chèn ảnh:** Trang Tổng quan đầy đủ  
> `docs/images/admin/04-tong-quan.png`

---

## 4. Sản phẩm

### 4.1. Danh sách sản phẩm (`/admin/products`)

**Thao tác trên trang**

- Bấm **Thêm sản phẩm** để tạo mới.
- Cột bảng: **Tên** · **SKU** · **Giá** · **Published** (`Có` / `Không`) · **Sửa** / **Xóa**.

<!-- Ảnh: 05-ds-san-pham.png -->
> 📸 **Chèn ảnh:** Danh sách sản phẩm  
> `docs/images/admin/05-ds-san-pham.png`

> ⚠️ **Xóa sản phẩm không có hộp thoại xác nhận.** Chỉ bấm **Xóa** khi chắc chắn.

---

### 4.2. Form thêm / sửa sản phẩm

- Thêm mới: `/admin/products/new`
- Sửa: `/admin/products/[id]` → bấm **Sửa** từ danh sách

<!-- Ảnh: 06-form-san-pham.png -->
> 📸 **Chèn ảnh:** Form sản phẩm (toàn trang hoặc phần trên)  
> `docs/images/admin/06-form-san-pham.png`

#### Các trường trên form

| Trường | Bắt buộc | Mô tả |
|--------|----------|--------|
| **Tên** | Có | Tên hiển thị. Hệ thống **tự tạo URL (slug)** và **SKU** từ tên |
| **Giá** | Có | Giá bán (số) |
| **Giá khuyến mãi** | Không | Để trống nếu không giảm giá |
| **Tồn kho** | Không | Mặc định `0` nếu không nhập |
| **Danh mục** | Nên chọn | Chọn danh mục đã tạo |
| **Mô tả ngắn** | Không | Hiện cạnh giá trên trang sản phẩm |
| **Mô tả chi tiết** | Không | Soạn thảo rich text (có thể chèn ảnh) |
| **Ảnh chính** | Không | URL hoặc **Tải ảnh chính lên** |
| **Ảnh phụ (gallery)** | Không | Tải nhiều ảnh / dán URL / sắp xếp ↑↓ / Xóa |
| **Thông số sản phẩm** | Không | Tối đa **4** dòng (Tên trường + Giá trị) |
| **SEO title** | Không | Tiêu đề SEO |
| **SEO description** | Không | Mô tả SEO |
| **Published** | Checkbox | Bật = hiện trên cửa hàng. **Sản phẩm mới mặc định bật** |
| **Featured** | Checkbox | Nổi bật trang chủ (tối đa khoảng 8 SP) |

Nút lưu: **Lưu sản phẩm**.

#### Hành vi đặc biệt cần nhớ

1. **Không nhập slug / SKU thủ công** — hệ thống tự sinh. Nếu báo trùng, thử lưu lại (hệ thống sẽ tạo mã mới).
2. Dưới ô **Tên** có dòng gợi ý: `URL sẽ lưu: /san-pham/{slug} (tự tạo)`.
3. Ảnh hỗ trợ: **JPG, PNG, GIF, WEBP** — tối đa **5MB**/ảnh.
4. Thông số ví dụ: *Vô trùng* → *Có*.

<!-- Ảnh: 07-form-san-pham-anh-thong-so.png -->
> 📸 **Chèn ảnh:** Phần ảnh + thông số sản phẩm  
> `docs/images/admin/07-form-san-pham-anh-thong-so.png`

---

## 5. Bài viết sức khỏe

### 5.1. Danh sách (`/admin/articles`)

- Nút **Thêm bài viết**
- Cột: **Tiêu đề** · **Tags** · **Published** · **Sửa** / **Xóa**
- Nếu trống: hiện *Chưa có bài viết* và link **Tạo bài đầu tiên**

<!-- Ảnh: 08-ds-bai-viet.png -->
> 📸 **Chèn ảnh:** Danh sách bài viết  
> `docs/images/admin/08-ds-bai-viet.png`

### 5.2. Form thêm / sửa bài viết

| Trường | Bắt buộc | Mô tả |
|--------|----------|--------|
| **Tiêu đề** | Có | Tự sinh URL `/bai-viet-suc-khoe/{slug}` |
| **Tóm tắt** | Không | Hiện ở danh sách bài |
| **Nội dung** | Không | Rich text, có thể chèn ảnh |
| **Ảnh bìa (thumbnail)** | Không | URL / **Tải ảnh bìa lên** / **Xóa ảnh bìa** |
| **Tags** | Không | Phân cách bằng dấu phẩy, **tối đa 5** tag |
| **SEO title / SEO description** | Không | Tối ưu tìm kiếm |
| **Xuất bản** | Checkbox | Bật mới hiện trên cửa hàng. **Bài mới mặc định tắt** |

Nút lưu: **Lưu bài viết**.

<!-- Ảnh: 09-form-bai-viet.png -->
> 📸 **Chèn ảnh:** Form bài viết sức khỏe  
> `docs/images/admin/09-form-bai-viet.png`

> 💡 **Khác với sản phẩm:** bài viết dùng checkbox **Xuất bản** (không ghi «Published»). Nên soạn xong rồi mới bật xuất bản.

---

## 6. Danh mục

Trang `/admin/categories` gồm **2 cột**:

| Cột trái | Cột phải |
|----------|----------|
| Danh sách tên + slug + nút **Xóa** | Form **Thêm / cập nhật danh mục** |

<!-- Ảnh: 10-danh-muc.png -->
> 📸 **Chèn ảnh:** Trang danh mục (list + form)  
> `docs/images/admin/10-danh-muc.png`

### Form danh mục

| Trường | Mô tả |
|--------|--------|
| **ID (để trống = tạo mới)** | Để trống khi thêm mới. **Điền đúng ID** khi muốn cập nhật danh mục đã có |
| **Tên** | Tên danh mục; URL tự tạo `/danh-muc/{slug}` |
| **Mô tả** | Mô tả ngắn |
| **Sort** | Thứ tự sắp xếp (số; mặc định `0`) |
| **Ảnh danh mục** | URL / **Tải ảnh lên** / **Xóa ảnh** — hiện trang chủ & trang danh mục |

Nút lưu: **Lưu**.

> ⚠️ Trang **không có nút «Sửa» từng dòng**. Muốn sửa: copy **ID** từ hệ thống/dữ liệu đã biết, điền vào ô ID rồi chỉnh các trường và **Lưu**.  
> Xóa danh mục cũng **không có xác nhận** — thao tác cẩn thận.

---

## 7. Đơn hàng

Trang `/admin/orders` liệt kê đơn khách gửi từ cửa hàng.

Mỗi đơn thường gồm:

- Mã đơn
- Tên khách · Số điện thoại
- Địa chỉ
- Tổng tiền
- Danh sách dòng: `Tên sản phẩm × số lượng`
- **Trạng thái** hiện tại
- Form đổi trạng thái + nút **Cập nhật**

<!-- Ảnh: 11-don-hang.png -->
> 📸 **Chèn ảnh:** Danh sách / chi tiết một đơn hàng  
> `docs/images/admin/11-don-hang.png`

### Trạng thái đơn hàng

Có thể chọn **bất kỳ** trạng thái nào (không bắt buộc đi theo thứ tự cứng):

| Giá trị | Nhãn hiển thị | Gợi ý dùng |
|---------|---------------|------------|
| `pending` | **Chờ xác nhận** | Đơn mới từ website (mặc định) |
| `confirmed` | **Đã xác nhận** | Đã gọi/xác nhận với khách |
| `paid` | **Đã thanh toán** | Khách đã CK / thanh toán |
| `shipped` | **Đã giao** | Đã giao hàng |
| `cancelled` | **Đã hủy** | Hủy đơn |

**Cách cập nhật**

1. Chọn trạng thái mới trong danh sách.
2. Bấm **Cập nhật**.
3. Chờ thông báo thành công (hoặc *Đang lưu...* khi đang xử lý).

<!-- Ảnh: 12-doi-trang-thai-don.png -->
> 📸 **Chèn ảnh:** Form đổi trạng thái đơn  
> `docs/images/admin/12-doi-trang-thai-don.png`

Nếu chưa có đơn: trang hiện *Chưa có đơn.*

---

## 8. Branding + CK/QR

Trang `/admin/branding` dùng để đổi nhận diện cửa hàng và thông tin chuyển khoản / QR — **không cần sửa code**.

Mô tả trên trang: *Đổi logo, màu, thông tin shop và QR chuyển khoản — dùng để nhân bản white-label.*

<!-- Ảnh: 13-branding.png -->
> 📸 **Chèn ảnh:** Form Branding + phần preview màu  
> `docs/images/admin/13-branding.png`

### 8.1. Thông tin & brand

| Trường | Ghi chú |
|--------|---------|
| **Tên shop** | Bắt buộc |
| **Tagline** | Khẩu hiệu ngắn |
| **Hotline** | Số điện thoại liên hệ |
| **Email** | Email shop |
| **Địa chỉ** | Địa chỉ hiển thị |
| **Logo URL** | Đường dẫn logo |
| **Favicon URL** | Icon tab trình duyệt |
| **Primary / Secondary / Accent color** | Màu thương hiệu |
| **Facebook URL / Zalo URL** | Liên kết mạng xã hội |

Trang có **Live preview màu** để xem trước.

### 8.2. Chuyển khoản + QR

| Trường | Ghi chú |
|--------|---------|
| **Ngân hàng** | Tên ngân hàng |
| **Số TK** | Số tài khoản |
| **Chủ TK** | Tên chủ tài khoản |
| **Nội dung CK (dùng {code})** | Mẫu nội dung CK; `{code}` sẽ được thay bằng **mã đơn**. Mặc định gợi ý: `DH {code}` |
| **QR image URL** | Ảnh QR chuyển khoản |

Nút lưu: **Lưu branding**.

> Sau khi lưu, **tải lại (reload) trang cửa hàng** để thấy logo/màu/thông tin mới.

<!-- Ảnh: 14-branding-ck-qr.png -->
> 📸 **Chèn ảnh:** Phần Chuyển khoản + QR  
> `docs/images/admin/14-branding-ck-qr.png`

---

## 9. Email preview

Trang `/admin/email-preview` giúp **xem trước** email thông báo «đơn mới» gửi cho admin.

- Dùng dữ liệu mẫu (không gửi email thật từ trang này).
- Email thật chỉ gửi khi khách **đặt hàng thành công** trên cửa hàng (nếu máy chủ đã cấu hình gửi mail).

<!-- Ảnh: 15-email-preview.png -->
> 📸 **Chèn ảnh:** Preview email đơn hàng  
> `docs/images/admin/15-email-preview.png`

Phần kỹ thuật (tham khảo cho IT): cấu hình `GMAIL_USER` + `GMAIL_APP_PASSWORD` hoặc `RESEND_API_KEY`; email nhận thường là `ADMIN_NOTIFY_EMAIL` / `ADMIN_EMAIL`.

---

## 10. Lưu ý quan trọng

1. **Published (sản phẩm)** vs **Xuất bản (bài viết)** — chỉ nội dung đã bật mới hiện trên cửa hàng.
2. Sản phẩm mới mặc định **Published = bật**; bài viết mới mặc định **chưa xuất bản**.
3. **Featured** = hiện khối nổi bật trang chủ.
4. Slug URL và SKU **tự sinh từ tên** — không chỉnh tay trên form.
5. Ảnh: JPG/PNG/GIF/WEBP, ≤ 5MB; cần đang đăng nhập Admin mới tải lên được.
6. Xóa sản phẩm / danh mục / bài viết: **không có hộp thoại xác nhận**.
7. Danh mục: cập nhật bằng cách điền **ID**, không có nút Sửa từng dòng.
8. Doanh thu trên dashboard có thể tính trên các đơn đã ghi nhận (kể cả đơn đã hủy tùy cách tổng hợp) — dùng để theo dõi nhanh, không thay báo cáo kế toán.
9. Admin được đánh dấu **noindex** (không khuyến khích Google index khu vực quản trị).
10. Không dùng Admin để “seed” dữ liệu mẫu từ giao diện — việc nhập catalog hàng loạt do kỹ thuật xử lý riêng nếu cần.

---

## 11. Checklist thao tác hàng ngày

### Khi có đơn mới

- [ ] Vào **Đơn hàng** / hoặc nút **Đơn chờ** từ Tổng quan
- [ ] Gọi / Zalo khách xác nhận
- [ ] Đổi trạng thái → **Đã xác nhận**
- [ ] Khi nhận tiền → **Đã thanh toán**
- [ ] Khi giao xong → **Đã giao**
- [ ] Nếu hủy → **Đã hủy**

### Khi thêm sản phẩm mới

- [ ] Tạo / chọn đúng **Danh mục**
- [ ] Điền **Tên**, **Giá**, tồn kho, mô tả
- [ ] Tải **Ảnh chính** (+ gallery nếu có)
- [ ] Điền **Thông số** (nếu cần)
- [ ] Kiểm tra **Published** / **Featured**
- [ ] **Lưu sản phẩm** → mở cửa hàng kiểm tra URL `/san-pham/...`

### Khi đăng bài sức khỏe

- [ ] Viết tiêu đề, tóm tắt, nội dung
- [ ] Chọn ảnh bìa
- [ ] Thêm tags (≤ 5)
- [ ] Bật **Xuất bản** khi sẵn sàng
- [ ] **Lưu bài viết** → kiểm tra trên `/bai-viet-suc-khoe/...`

### Khi đổi branding / CK

- [ ] Cập nhật thông tin & màu / logo
- [ ] Cập nhật ngân hàng, số TK, QR, mẫu nội dung có `{code}`
- [ ] **Lưu branding** → reload cửa hàng để xác nhận

---

## Phụ lục A — Sơ đồ điều hướng nhanh

```text
/admin/login
    └── Đăng nhập thành công
            └── /admin                    Tổng quan
            ├── /admin/products           DS sản phẩm
            │     ├── /admin/products/new
            │     └── /admin/products/[id]
            ├── /admin/articles           DS bài viết
            │     ├── /admin/articles/new
            │     └── /admin/articles/[id]
            ├── /admin/categories
            ├── /admin/orders
            ├── /admin/branding
            └── /admin/email-preview
```

---

## Phụ lục B — Danh sách ảnh cần chèn

| # | Tên file gợi ý | Nội dung ảnh |
|---|----------------|--------------|
| 01 | `01-dang-nhap.png` | Form đăng nhập |
| 02 | `02-dang-xuat.png` | Nút đăng xuất |
| 03 | `03-sidebar.png` | Sidebar menu |
| 04 | `04-tong-quan.png` | Dashboard |
| 05 | `05-ds-san-pham.png` | Bảng sản phẩm |
| 06 | `06-form-san-pham.png` | Form SP (phần trên) |
| 07 | `07-form-san-pham-anh-thong-so.png` | Ảnh + thông số |
| 08 | `08-ds-bai-viet.png` | Bảng bài viết |
| 09 | `09-form-bai-viet.png` | Form bài viết |
| 10 | `10-danh-muc.png` | Trang danh mục |
| 11 | `11-don-hang.png` | Danh sách đơn |
| 12 | `12-doi-trang-thai-don.png` | Đổi trạng thái |
| 13 | `13-branding.png` | Branding tổng |
| 14 | `14-branding-ck-qr.png` | Phần CK/QR |
| 15 | `15-email-preview.png` | Preview email |

Thư mục đích: `docs/images/admin/`

Sau khi có file ảnh, thay các khối `> 📸 **Chèn ảnh:** ...` bằng:

```markdown
![Mô tả ngắn](./images/admin/01-dang-nhap.png)
```

---

*Tài liệu hướng dẫn người dùng Admin — phiên bản dựa trên giao diện hiện tại của website. Khi UI đổi nhãn nút/trường, cập nhật lại các bảng tương ứng trong file này.*
