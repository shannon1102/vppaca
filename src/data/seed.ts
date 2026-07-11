import type { Category, HealthArticle, Product, SiteSettings } from "@/lib/types";

export const defaultSettings: SiteSettings = {
  id: "default",
  shop_name: "Thiết bị Y tế Tâm Đức",
  tagline: "Tận tâm vì sức khỏe từng gia đình",
  phone: "0962 732 786",
  email: "lienhe@thietbiytetamduc.vn",
  address:
    "CS1: 200 Nguyễn Viết Xuân, Hà Cầu, Hà Đông | CS2: 18 LK06A, Làng Việt Kiều, Mỗ Lao, Hà Đông",
  logo_url: "/brand/tam-duc-logo.png",
  favicon_url: "/brand/tam-duc-favicon.png",
  primary_color: "#2E7D32",
  secondary_color: "#1B4332",
  accent_color: "#8BC34A",
  bank_name: "Vietcombank",
  bank_account: "0123456789",
  bank_holder: "CONG TY TNHH DICH VU Y KHOA CO TRUYEN TAM DUC",
  transfer_content_template: "DH {code}",
  qr_image_url: "/seed/qr-demo.svg",
  facebook_url: "https://www.facebook.com/profile.php?id=61561988987352",
  zalo_url: "https://zalo.me/0962732786",
};

export const seedCategories: Category[] = [
  {
    id: "cat-1",
    name: "Máy đo sức khỏe",
    slug: "may-do-suc-khoe",
    description: "Máy đo huyết áp, SpO2, đường huyết, nhiệt kế",
    sort: 1,
    image_url: "/seed/product-01.svg",
  },
  {
    id: "cat-2",
    name: "Chăm sóc vết thương",
    slug: "cham-soc-vet-thuong",
    description: "Băng gạc, sát trùng, bộ sơ cứu",
    sort: 2,
    image_url: "/seed/product-08.svg",
  },
  {
    id: "cat-3",
    name: "Thiết bị phòng khám",
    slug: "thiet-bi-phong-kham",
    description: "Ống nghe, đèn khám, máy hút dịch",
    sort: 3,
    image_url: "/seed/product-04.svg",
  },
  {
    id: "cat-4",
    name: "Bảo hộ y tế",
    slug: "bao-ho-y-te",
    description: "Găng tay, khẩu trang, đồ bảo hộ",
    sort: 4,
    image_url: "/seed/product-09.svg",
  },
  {
    id: "cat-5",
    name: "Phục hồi chức năng",
    slug: "phuc-hoi-chuc-nang",
    description: "Xe lăn, giường y tế, vật lý trị liệu",
    sort: 5,
    image_url: "/seed/product-15.svg",
  },
];

type SeedProduct = Omit<Product, "images" | "detail_description"> & {
  imageIndex: number;
  extraImages?: number[];
  detail_description?: string;
};

const raw: SeedProduct[] = [
  {
    id: "p-01",
    name: "Máy đo huyết áp bắp tay tự động",
    slug: "may-do-huyet-ap-bap-tay",
    sku: "MED-BP-001",
    price: 890000,
    sale_price: 790000,
    description:
      "Máy đo huyết áp bắp tay tự động, màn hình LCD lớn, bộ nhớ 120 kết quả. Phù hợp gia đình và phòng khám.",
    detail_description:
      "<h2>Thông số nổi bật</h2><ul><li>Màn hình LCD lớn, dễ đọc</li><li>Bộ nhớ 120 kết quả cho 2 người dùng</li><li>Phát hiện nhịp tim không đều</li><li>Tự động tắt sau 1 phút</li></ul><h2>Hướng dẫn sử dụng</h2><p>Quấn băng quanh bắp tay, ngồi thẳng lưng, đo trong tư thế nghỉ ngơi ít nhất 5 phút.</p>",
    specs: { "Độ chính xác": "±3 mmHg", "Nguồn": "Pin AA / adapter", "Bảo hành": "24 tháng" },
    category_id: "cat-1",
    imageIndex: 1,
    stock: 50,
    is_published: true,
    is_featured: true,
    seo_title: "Máy đo huyết áp bắp tay tự động | Thiết bị Y tế Tâm Đức",
    seo_description: "Máy đo huyết áp chính xác, dễ dùng, bảo hành 24 tháng.",
  },
  {
    id: "p-02",
    name: "Nhiệt kế hồng ngoại không tiếp xúc",
    slug: "nhiet-ke-hong-ngoai",
    sku: "MED-TH-002",
    price: 350000,
    sale_price: null,
    description: "Đo nhiệt độ trán trong 1 giây, cảnh báo sốt, phù hợp trẻ em và người lớn.",
    specs: { "Thời gian đo": "1 giây", "Khoảng đo": "32–42.9°C", "Bảo hành": "12 tháng" },
    category_id: "cat-1",
    imageIndex: 2,
    stock: 80,
    is_published: true,
    is_featured: true,
    seo_title: "Nhiệt kế hồng ngoại không tiếp xúc",
    seo_description: "Nhiệt kế hồng ngoại đo nhanh, an toàn cho trẻ em.",
  },
  {
    id: "p-03",
    name: "Máy đo SpO2 đầu ngón tay",
    slug: "may-do-spo2",
    sku: "MED-OX-003",
    price: 420000,
    sale_price: 390000,
    description: "Đo nồng độ oxy máu và nhịp tim, màn OLED, nhỏ gọn mang theo.",
    specs: { "Hiển thị": "OLED", "Pin": "2 x AAA", "Bảo hành": "12 tháng" },
    category_id: "cat-1",
    imageIndex: 3,
    stock: 60,
    is_published: true,
    is_featured: false,
    seo_title: "Máy đo SpO2 đầu ngón tay",
    seo_description: "Máy đo SpO2 chính xác, tiện lợi mang theo.",
  },
  {
    id: "p-04",
    name: "Ống nghe y tế 2 mặt",
    slug: "ong-nghe-y-te",
    sku: "MED-ST-004",
    price: 280000,
    sale_price: null,
    description: "Ống nghe 2 mặt cho tim phổi, ống mềm chống ồn, dùng phòng khám.",
    specs: { "Chất liệu": "Hợp kim + PVC", "Màu": "Xanh navy", "Bảo hành": "6 tháng" },
    category_id: "cat-3",
    imageIndex: 4,
    stock: 40,
    is_published: true,
    is_featured: true,
    seo_title: "Ống nghe y tế 2 mặt chuyên dụng",
    seo_description: "Ống nghe y tế chất lượng cho bác sĩ và sinh viên y.",
  },
  {
    id: "p-05",
    name: "Máy xông mũi họng nén khí",
    slug: "may-xong-mui-hong",
    sku: "MED-NB-005",
    price: 650000,
    sale_price: 599000,
    description: "Máy xông khí dung nén khí, hạt sương mịn, hỗ trợ hô hấp tại nhà.",
    specs: { "Công suất": "60W", "Dung tích cốc": "6ml", "Bảo hành": "18 tháng" },
    category_id: "cat-1",
    imageIndex: 5,
    stock: 35,
    is_published: true,
    is_featured: false,
    seo_title: "Máy xông mũi họng nén khí",
    seo_description: "Máy xông khí dung gia đình, hạt sương mịn.",
  },
  {
    id: "p-06",
    name: "Máy massage xung điện TENS",
    slug: "may-massage-xung-dien",
    sku: "MED-TN-006",
    price: 750000,
    sale_price: null,
    description: "Máy TENS giảm đau cơ xương khớp, nhiều chế độ massage.",
    specs: { "Kênh": "2 kênh", "Chế độ": "8 modes", "Bảo hành": "12 tháng" },
    category_id: "cat-5",
    imageIndex: 6,
    stock: 25,
    is_published: true,
    is_featured: false,
    seo_title: "Máy massage xung điện TENS",
    seo_description: "Máy TENS hỗ trợ giảm đau và phục hồi.",
  },
  {
    id: "p-07",
    name: "Đèn pin khám bệnh LED",
    slug: "den-pin-kham-led",
    sku: "MED-LT-007",
    price: 180000,
    sale_price: 150000,
    description: "Đèn pin LED khám họng/tai mũi họng, sáng trắng, pin sạc USB.",
    specs: { "Độ sáng": "LED 3W", "Sạc": "USB-C", "Bảo hành": "6 tháng" },
    category_id: "cat-3",
    imageIndex: 7,
    stock: 70,
    is_published: true,
    is_featured: false,
    seo_title: "Đèn pin khám bệnh LED",
    seo_description: "Đèn khám LED sáng, sạc USB tiện lợi.",
  },
  {
    id: "p-08",
    name: "Bộ sơ cứu gia đình 50 món",
    slug: "bo-so-cuu-gia-dinh",
    sku: "MED-FA-008",
    price: 320000,
    sale_price: null,
    description: "Bộ sơ cứu đầy đủ băng gạc, kéo, găng, sát trùng — dùng nhà và văn phòng.",
    specs: { "Số món": "50+", "Túi": "Chống nước", "Xuất xứ": "Việt Nam" },
    category_id: "cat-2",
    imageIndex: 8,
    stock: 45,
    is_published: true,
    is_featured: true,
    seo_title: "Bộ sơ cứu gia đình 50 món",
    seo_description: "Bộ sơ cứu đầy đủ cho gia đình và văn phòng.",
  },
  {
    id: "p-09",
    name: "Găng tay y tế nitrile (hộp 100)",
    slug: "gang-tay-nitrile",
    sku: "MED-GL-009",
    price: 210000,
    sale_price: 189000,
    description: "Găng nitrile không bột, đàn hồi tốt, size M/L.",
    specs: { "Chất liệu": "Nitrile", "Số lượng": "100 chiếc", "Size": "M/L" },
    category_id: "cat-4",
    imageIndex: 9,
    stock: 200,
    is_published: true,
    is_featured: false,
    seo_title: "Găng tay y tế nitrile hộp 100",
    seo_description: "Găng nitrile không bột, an toàn phòng khám.",
  },
  {
    id: "p-10",
    name: "Khẩu trang N95 (hộp 20)",
    slug: "khau-trang-n95",
    sku: "MED-MS-010",
    price: 250000,
    sale_price: null,
    description: "Khẩu trang N95 lọc ≥95%, quai đeo chắc, đạt chuẩn bảo hộ.",
    specs: { "Lọc": "≥95%", "Số lượng": "20 chiếc", "Chuẩn": "N95" },
    category_id: "cat-4",
    imageIndex: 10,
    stock: 150,
    is_published: true,
    is_featured: false,
    seo_title: "Khẩu trang N95 hộp 20 chiếc",
    seo_description: "Khẩu trang N95 bảo hộ y tế chất lượng.",
  },
  {
    id: "p-11",
    name: "Băng dán vô trùng 6×10cm (hộp)",
    slug: "bang-dan-vo-trung",
    sku: "MED-BD-011",
    price: 95000,
    sale_price: 85000,
    description: "Băng dán vô trùng thấm hút tốt, dùng chăm sóc vết thương nhỏ.",
    specs: { "Kích thước": "6×10cm", "Số miếng": "50", "Vô trùng": "Có" },
    category_id: "cat-2",
    imageIndex: 11,
    stock: 120,
    is_published: true,
    is_featured: false,
    seo_title: "Băng dán vô trùng 6x10cm",
    seo_description: "Băng dán vô trùng chăm sóc vết thương.",
  },
  {
    id: "p-12",
    name: "Cồn sát trùng 70 độ 500ml",
    slug: "con-sat-trung-70",
    sku: "MED-AL-012",
    price: 45000,
    sale_price: null,
    description: "Cồn 70 độ sát khuẩn dụng cụ và bề mặt, chai 500ml.",
    specs: { "Nồng độ": "70%", "Dung tích": "500ml", "Dạng": "Lỏng" },
    category_id: "cat-2",
    imageIndex: 12,
    stock: 300,
    is_published: true,
    is_featured: false,
    seo_title: "Cồn sát trùng 70 độ 500ml",
    seo_description: "Cồn sát trùng 70 độ dùng y tế và gia đình.",
  },
  {
    id: "p-13",
    name: "Máy hút dịch mũi trẻ em",
    slug: "may-hut-dich-mui",
    sku: "MED-SU-013",
    price: 480000,
    sale_price: 450000,
    description: "Máy hút dịch mũi điện, lực hút điều chỉnh, an toàn cho bé.",
    specs: { "Nguồn": "Pin sạc", "Mức hút": "3 mức", "Bảo hành": "12 tháng" },
    category_id: "cat-3",
    imageIndex: 13,
    stock: 30,
    is_published: true,
    is_featured: true,
    seo_title: "Máy hút dịch mũi trẻ em",
    seo_description: "Máy hút mũi điện an toàn cho trẻ nhỏ.",
  },
  {
    id: "p-14",
    name: "Giường y tế gấp gọn",
    slug: "giuong-y-te-gap",
    sku: "MED-BD-014",
    price: 3200000,
    sale_price: 2990000,
    description: "Giường y tế khung thép sơn tĩnh điện, gấp gọn, tải trọng 150kg.",
    specs: { "Tải trọng": "150kg", "Khung": "Thép", "Bảo hành": "24 tháng" },
    category_id: "cat-5",
    imageIndex: 14,
    stock: 10,
    is_published: true,
    is_featured: false,
    seo_title: "Giường y tế gấp gọn",
    seo_description: "Giường y tế gấp, chắc chắn, giao toàn quốc.",
  },
  {
    id: "p-15",
    name: "Xe lăn nhôm cao cấp",
    slug: "xe-lan-nhom",
    sku: "MED-WC-015",
    price: 2800000,
    sale_price: null,
    description: "Xe lăn khung nhôm nhẹ, gấp được, bánh xe êm, phù hợp người cao tuổi.",
    specs: { "Trọng lượng": "12kg", "Tải trọng": "120kg", "Bảo hành": "24 tháng" },
    category_id: "cat-5",
    imageIndex: 15,
    stock: 15,
    is_published: true,
    is_featured: true,
    seo_title: "Xe lăn nhôm cao cấp",
    seo_description: "Xe lăn nhôm nhẹ, gấp gọn, bền đẹp.",
  },
  {
    id: "p-16",
    name: "Máy đo đường huyết + 50 que thử",
    slug: "may-do-duong-huyet",
    sku: "MED-GLU-016",
    price: 550000,
    sale_price: 520000,
    description: "Máy đo đường huyết kèm 50 que thử, kết quả nhanh 5 giây.",
    specs: { "Thời gian": "5 giây", "Que thử": "50 que", "Bảo hành": "36 tháng" },
    category_id: "cat-1",
    imageIndex: 16,
    stock: 40,
    is_published: true,
    is_featured: true,
    seo_title: "Máy đo đường huyết kèm que thử",
    seo_description: "Máy đo đường huyết chính xác, kèm 50 que.",
  },
  {
    id: "p-17",
    name: "Máy nebulizer siêu âm",
    slug: "may-nebulizer-sieu-am",
    sku: "MED-NEB-017",
    price: 980000,
    sale_price: null,
    description: "Nebulizer siêu âm êm, hạt mịn, phù hợp trẻ em và người lớn.",
    specs: { "Công nghệ": "Siêu âm", "Độ ồn": "<40dB", "Bảo hành": "18 tháng" },
    category_id: "cat-1",
    imageIndex: 17,
    stock: 20,
    is_published: true,
    is_featured: false,
    seo_title: "Máy nebulizer siêu âm",
    seo_description: "Máy xông siêu âm êm ái, hạt sương mịn.",
  },
  {
    id: "p-18",
    name: "Cân sức khỏe điện tử Bluetooth",
    slug: "can-suc-khoe-bluetooth",
    sku: "MED-SC-018",
    price: 390000,
    sale_price: 350000,
    description: "Cân điện tử đo BMI, kết nối app Bluetooth, kính cường lực.",
    specs: { "Tải trọng": "180kg", "Kết nối": "Bluetooth", "Bảo hành": "12 tháng" },
    category_id: "cat-1",
    imageIndex: 18,
    stock: 55,
    is_published: true,
    is_featured: false,
    seo_title: "Cân sức khỏe điện tử Bluetooth",
    seo_description: "Cân thông minh đo BMI, kết nối điện thoại.",
  },
  {
    id: "p-19",
    name: "Máy vật lý trị liệu siêu âm cầm tay",
    slug: "may-vat-ly-tri-lieu",
    sku: "MED-US-019",
    price: 1500000,
    sale_price: 1390000,
    description: "Thiết bị siêu âm trị liệu cầm tay hỗ trợ giảm đau cơ khớp tại nhà.",
    specs: { "Tần số": "1 MHz", "Chế độ": "Xung / liên tục", "Bảo hành": "12 tháng" },
    category_id: "cat-5",
    imageIndex: 19,
    stock: 12,
    is_published: true,
    is_featured: false,
    seo_title: "Máy vật lý trị liệu siêu âm cầm tay",
    seo_description: "Máy siêu âm trị liệu hỗ trợ phục hồi tại nhà.",
  },
  {
    id: "p-20",
    name: "Bộ dụng cụ khám đa năng 5 món",
    slug: "bo-dung-cu-kham",
    sku: "MED-KIT-020",
    price: 450000,
    sale_price: null,
    description: "Bộ dụng cụ khám gồm đèn, búa phản xạ, thước đo, kéo y tế.",
    specs: { "Số món": "5", "Hộp": "Có", "Đối tượng": "Phòng khám / SVY" },
    category_id: "cat-3",
    imageIndex: 20,
    stock: 28,
    is_published: true,
    is_featured: true,
    seo_title: "Bộ dụng cụ khám đa năng 5 món",
    seo_description: "Bộ dụng cụ khám cơ bản cho phòng khám và sinh viên.",
  },
];

function img(n: number) {
  return `/seed/product-${String(n).padStart(2, "0")}.svg`;
}

export const seedProducts: Product[] = raw.map((p) => {
  const { imageIndex, extraImages, ...rest } = p;
  const images = [img(imageIndex)];
  if (extraImages) {
    for (const e of extraImages) images.push(img(e));
  } else {
    // second angle: next product image as gallery variety
    const next = imageIndex === 20 ? 1 : imageIndex + 1;
    images.push(img(next));
  }
  return { ...rest, images, detail_description: rest.detail_description ?? "" };
});

export const seedArticles: HealthArticle[] = [
  {
    id: "art-1",
    title: "Cách đo huyết áp tại nhà đúng chuẩn",
    slug: "cach-do-huyet-ap-tai-nha",
    excerpt:
      "Hướng dẫn tư thế ngồi, thời điểm đo và cách đọc kết quả máy đo huyết áp tại nhà.",
    content: `## Tại sao cần đo huyết áp đúng cách?

Đo huyết áp sai tư thế có thể làm kết quả **cao hơn 10–20 mmHg**, dẫn đến lo lắng không cần thiết hoặc bỏ sót bệnh lý.

## Chuẩn bị trước khi đo

1. Nghỉ ngơi **5 phút** sau khi vận động
2. Không uống cà phê, hút thuốc trong **30 phút** trước khi đo
3. Đi vệ sinh nếu cần — bàng quang đầy có thể ảnh hưởng kết quả

## Tư thế đo chuẩn

- Ngồi thẳng lưng, chân đặt phẳng sàn
- Tay đo ngang tim, lòng bàn tay hướng lên
- Quấn vòng bít vừa khít, không quá chặt

> **Lưu ý:** Nên đo **2–3 lần**, cách nhau 1–2 phút và lấy trung bình.

## Khi nào cần đi khám?

- Huyết áp tâm thu ≥ **140 mmHg** hoặc tâm trương ≥ **90 mmHg** lặp lại nhiều ngày
- Có triệu chứng: đau đầu, chóng mặt, mệt bất thường`,
    cover_image_url: "/seed/product-01.svg",
    tags: ["huyết áp", "sức khỏe tim mạch"],
    is_published: true,
    seo_title: "Cách đo huyết áp tại nhà đúng chuẩn",
    seo_description:
      "Hướng dẫn đo huyết áp tại nhà chuẩn y khoa: tư thế, thời điểm và cách đọc kết quả.",
    created_at: "2026-01-15T08:00:00.000Z",
    updated_at: "2026-01-15T08:00:00.000Z",
  },
  {
    id: "art-2",
    title: "Máy xông khí dung: dùng đúng cách cho trẻ và người lớn",
    slug: "may-xong-khi-dung-dung-cach",
    excerpt:
      "Các bước vệ sinh máy xông, pha thuốc và thời gian xông phù hợp theo hướng dẫn bác sĩ.",
    content: `## Máy xông khí dung là gì?

Máy xông khí dung chuyển thuốc dạng lỏng thành **hạt sương mù siêu nhỏ**, giúp thuốc tác dụng trực tiếp lên đường hô hấp.

## Các bước sử dụng cơ bản

1. Rửa tay và vệ sinh mặt nạ / ống thở
2. Pha thuốc theo **đơn bác sĩ** (không tự ý tăng liều)
3. Lắp đầy bình, bật máy và xông **5–10 phút**
4. Tháo rửa toàn bộ bộ phận tiếp xúc thuốc sau mỗi lần dùng

### Vệ sinh sau xông

- Ngâm mặt nạ trong nước ấm + nước rửa nhẹ
- Phơi khô nơi thoáng, tránh ánh nắng trực tiếp

## Dấu hiệu cần thay thiết bị

- Máy kêu to bất thường, hơi yếu
- Mặt nạ nứt, ống vàng bám thuốc không rửa sạch`,
    cover_image_url: "/seed/product-05.svg",
    tags: ["hô hấp", "xông khí dung"],
    is_published: true,
    seo_title: "Hướng dẫn dùng máy xông khí dung đúng cách",
    seo_description:
      "Cách vệ sinh, pha thuốc và xông khí dung an toàn cho trẻ em và người lớn.",
    created_at: "2026-02-01T08:00:00.000Z",
    updated_at: "2026-02-01T08:00:00.000Z",
  },
];
