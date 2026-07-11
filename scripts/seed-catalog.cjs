/**
 * Seed 20 SEO products + real photos into Supabase.
 * Usage: node scripts/seed-catalog.mjs
 */
const fs = require("fs");
const path = require("path");
const { createClient } = require("@supabase/supabase-js");

const root = path.join(__dirname, "..");

function loadEnv() {
  const raw = fs.readFileSync(path.join(root, ".env.local"), "utf8");
  const env = {};
  for (const line of raw.split(/\r?\n/)) {
    if (!line || line.trim().startsWith("#")) continue;
    const m = line.match(/^([A-Z0-9_]+)\s*=\s*(.*)$/);
    if (!m) continue;
    let v = m[2].trim();
    if (
      (v.startsWith('"') && v.endsWith('"')) ||
      (v.startsWith("'") && v.endsWith("'"))
    )
      v = v.slice(1, -1);
    env[m[1]] = v;
  }
  return env;
}

const env = loadEnv();
const url = env.NEXT_PUBLIC_SUPABASE_URL || env.SUPABASE_URL;
const key =
  env.SUPABASE_SERVICE_ROLE_KEY ||
  env.SUPABASE_SECRET_KEY ||
  env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
if (!url || !key) {
  console.error("Missing Supabase env");
  process.exit(1);
}
const sb = createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const img = (id) => `/products/${id}.jpg`;

const categories = [
  {
    id: "cat-1",
    name: "Máy đo sức khỏe",
    slug: "may-do-suc-khoe",
    description:
      "Máy đo huyết áp, SpO2, đường huyết, nhiệt kế — theo dõi sức khỏe tại nhà và phòng khám.",
    sort: 1,
    image_url: img("p-01"),
  },
  {
    id: "cat-2",
    name: "Chăm sóc vết thương",
    slug: "cham-soc-vet-thuong",
    description:
      "Băng gạc, sát trùng, bộ sơ cứu — vật tư y tế thiết yếu cho gia đình và cơ sở y tế.",
    sort: 2,
    image_url: img("p-08"),
  },
  {
    id: "cat-3",
    name: "Thiết bị phòng khám",
    slug: "thiet-bi-phong-kham",
    description:
      "Ống nghe, đèn khám, máy hút dịch và dụng cụ chuyên dụng cho phòng khám.",
    sort: 3,
    image_url: img("p-04"),
  },
  {
    id: "cat-4",
    name: "Bảo hộ y tế",
    slug: "bao-ho-y-te",
    description:
      "Găng tay, khẩu trang, đồ bảo hộ đạt chuẩn — an toàn cho nhân viên y tế và người dùng.",
    sort: 4,
    image_url: img("p-10"),
  },
  {
    id: "cat-5",
    name: "Phục hồi chức năng",
    slug: "phuc-hoi-chuc-nang",
    description:
      "Xe lăn, giường y tế, thiết bị vật lý trị liệu hỗ trợ phục hồi và chăm sóc dài hạn.",
    sort: 5,
    image_url: img("p-17"),
  },
];

/** 4 products × 5 categories = 20 */
const products = [
  // cat-1
  {
    id: "p-01",
    name: "Máy đo huyết áp bắp tay Omron-style tự động",
    slug: "may-do-huyet-ap-bap-tay-tu-dong",
    sku: "MED-BP-001",
    price: 1290000,
    sale_price: 990000,
    category_id: "cat-1",
    images: [img("p-01"), img("p-03")],
    stock: 86,
    is_featured: true,
    description:
      "Máy đo huyết áp bắp tay tự động, màn hình LCD lớn, bộ nhớ 120 kết quả, cảnh báo rối loạn nhịp. Phù hợp gia đình, người cao tuổi và phòng khám đa khoa. Hỗ trợ đo nhanh, chính xác, dễ sử dụng chỉ với một nút bấm.",
    specs: {
      "Độ chính xác": "±3 mmHg",
      "Chu vi bắp tay": "22–42 cm",
      "Bộ nhớ": "120 kết quả",
      "Bảo hành": "24 tháng",
      "Xuất xứ": "Chính hãng phân phối VN",
    },
    seo_title: "Máy đo huyết áp bắp tay tự động chính hãng | Thiết bị Y tế Tâm Đức",
    seo_description:
      "Mua máy đo huyết áp bắp tay tự động giá tốt tại Hà Nội. Chính xác ±3mmHg, bảo hành 24 tháng, giao toàn quốc.",
  },
  {
    id: "p-02",
    name: "Nhiệt kế hồng ngoại không tiếp xúc đa chế độ",
    slug: "nhiet-ke-hong-ngoai-khong-tiep-xuc",
    sku: "MED-TH-002",
    price: 450000,
    sale_price: 379000,
    category_id: "cat-1",
    images: [img("p-02"), img("p-07")],
    stock: 120,
    is_featured: true,
    description:
      "Nhiệt kế hồng ngoại đo trán/tai trong 1 giây, cảnh báo sốt bằng màu đèn và âm thanh. An toàn cho trẻ sơ sinh, không cần tiếp xúc trực tiếp — giảm nguy cơ lây nhiễm.",
    specs: {
      "Thời gian đo": "≤1 giây",
      "Khoảng đo": "32.0–42.9°C",
      "Độ lệch": "±0.2°C",
      "Bảo hành": "12 tháng",
    },
    seo_title: "Nhiệt kế hồng ngoại không tiếp xúc cho trẻ em | Thiết bị Y tế Tâm Đức",
    seo_description:
      "Nhiệt kế hồng ngoại đo nhanh 1 giây, cảnh báo sốt, an toàn trẻ em. Giá tốt, giao hàng toàn quốc.",
  },
  {
    id: "p-03",
    name: "Máy đo SpO2 đầu ngón tay OLED",
    slug: "may-do-spo2-dau-ngon-tay-oled",
    sku: "MED-OX-003",
    price: 520000,
    sale_price: 459000,
    category_id: "cat-1",
    images: [img("p-03"), img("p-15")],
    stock: 95,
    is_featured: false,
    description:
      "Máy đo nồng độ oxy máu (SpO2) và nhịp tim, màn OLED rõ nét, nhỏ gọn mang theo. Hữu ích theo dõi hô hấp tại nhà, người bệnh phổi, vận động viên.",
    specs: {
      "Chỉ số": "SpO2 + Pulse",
      "Màn hình": "OLED",
      "Pin": "2×AAA",
      "Bảo hành": "12 tháng",
    },
    seo_title: "Máy đo SpO2 đầu ngón tay OLED chính xác | Thiết bị Y tế Tâm Đức",
    seo_description:
      "Máy đo SpO2 và nhịp tim cầm tay, màn OLED, dễ dùng tại nhà. Bảo hành 12 tháng tại Thiết bị Y tế Tâm Đức.",
  },
  {
    id: "p-16",
    name: "Máy đo đường huyết kèm 50 que thử",
    slug: "may-do-duong-huyet-kem-que-thu",
    sku: "MED-GLU-016",
    price: 680000,
    sale_price: 590000,
    category_id: "cat-1",
    images: [img("p-16"), img("p-09")],
    stock: 64,
    is_featured: true,
    description:
      "Bộ máy đo đường huyết kèm 50 que thử, kết quả trong 5 giây, ít máu. Hỗ trợ người tiểu đường theo dõi đường huyết hàng ngày một cách chủ động.",
    specs: {
      "Thời gian": "5 giây",
      "Que thử kèm": "50 que",
      "Đơn vị": "mg/dL hoặc mmol/L",
      "Bảo hành": "36 tháng máy",
    },
    seo_title: "Máy đo đường huyết kèm 50 que thử | Thiết bị Y tế Tâm Đức",
    seo_description:
      "Máy đo đường huyết chính xác, kèm 50 que thử. Theo dõi tiểu đường tại nhà — giao hàng toàn quốc.",
  },
  // cat-2
  {
    id: "p-08",
    name: "Bộ sơ cứu gia đình 50 món đạt chuẩn",
    slug: "bo-so-cuu-gia-dinh-50-mon",
    sku: "MED-FA-008",
    price: 390000,
    sale_price: 329000,
    category_id: "cat-2",
    images: [img("p-08"), img("p-11")],
    stock: 78,
    is_featured: true,
    description:
      "Bộ sơ cứu đầy đủ băng gạc, kéo, găng, sát trùng, miếng dán — dùng nhà, văn phòng, xe hơi. Túi chống nước, sắp xếp ngăn nắp theo checklist sơ cứu cơ bản.",
    specs: {
      "Số món": "50+",
      "Túi": "Chống nước",
      "Đối tượng": "Gia đình / văn phòng",
      "Xuất xứ": "Việt Nam",
    },
    seo_title: "Bộ sơ cứu gia đình 50 món giá tốt | Thiết bị Y tế Tâm Đức",
    seo_description:
      "Bộ sơ cứu 50 món đầy đủ cho gia đình và văn phòng. Túi chống nước, giao nhanh toàn quốc.",
  },
  {
    id: "p-11",
    name: "Băng dán vô trùng 6×10cm (hộp 50)",
    slug: "bang-dan-vo-trung-6x10cm",
    sku: "MED-BD-011",
    price: 120000,
    sale_price: 99000,
    category_id: "cat-2",
    images: [img("p-11"), img("p-08")],
    stock: 200,
    is_featured: false,
    description:
      "Băng dán vô trùng thấm hút tốt, kích thước 6×10cm, hộp 50 miếng. Dùng chăm sóc vết thương nhỏ, sau tiêm, trầy xước — an toàn da nhạy cảm.",
    specs: {
      "Kích thước": "6×10 cm",
      "Số lượng": "50 miếng",
      "Vô trùng": "Có",
      "Thấm hút": "Cao",
    },
    seo_title: "Băng dán vô trùng 6x10cm hộp 50 miếng | Thiết bị Y tế Tâm Đức",
    seo_description:
      "Băng dán vô trùng thấm hút tốt, hộp 50 miếng. Chăm sóc vết thương tại nhà — giá sỉ/lẻ.",
  },
  {
    id: "p-12",
    name: "Cồn sát trùng 70 độ chai 500ml",
    slug: "con-sat-trung-70-do-500ml",
    sku: "MED-AL-012",
    price: 55000,
    sale_price: null,
    category_id: "cat-2",
    images: [img("p-12"), img("p-19")],
    stock: 350,
    is_featured: false,
    description:
      "Cồn sát trùng 70 độ chai 500ml — sát khuẩn dụng cụ, bề mặt và da trước khi tiêm. Dùng phổ biến tại nhà thuốc, phòng khám và hộ gia đình.",
    specs: {
      "Nồng độ": "70%",
      "Dung tích": "500 ml",
      "Dạng": "Lỏng",
      "Công dụng": "Sát khuẩn",
    },
    seo_title: "Cồn sát trùng 70 độ 500ml chính hãng | Thiết bị Y tế Tâm Đức",
    seo_description:
      "Cồn sát trùng 70 độ chai 500ml giá tốt. Sát khuẩn dụng cụ và bề mặt — giao hàng nhanh.",
  },
  {
    id: "p-19",
    name: "Gel rửa tay khô kháng khuẩn 500ml",
    slug: "gel-rua-tay-kho-khang-khuan-500ml",
    sku: "MED-HS-019",
    price: 89000,
    sale_price: 75000,
    category_id: "cat-2",
    images: [img("p-19"), img("p-12")],
    stock: 180,
    is_featured: false,
    description:
      "Gel rửa tay khô kháng khuẩn, không cần nước, khô nhanh không dính tay. Phù hợp văn phòng, trường học, phòng khám và mang theo khi đi lại.",
    specs: {
      "Dung tích": "500 ml",
      "Cồn": "≥70%",
      "Mùi": "Dễ chịu",
      "Đóng gói": "Chai bơm",
    },
    seo_title: "Gel rửa tay khô kháng khuẩn 500ml | Thiết bị Y tế Tâm Đức",
    seo_description:
      "Gel rửa tay khô kháng khuẩn 500ml, khô nhanh. Bảo vệ sức khỏe gia đình — mua tại Thiết bị Y tế Tâm Đức.",
  },
  // cat-3
  {
    id: "p-04",
    name: "Ống nghe y tế 2 mặt chuyên dụng",
    slug: "ong-nghe-y-te-2-mat-chuyen-dung",
    sku: "MED-ST-004",
    price: 350000,
    sale_price: 299000,
    category_id: "cat-3",
    images: [img("p-04"), img("p-20")],
    stock: 55,
    is_featured: true,
    description:
      "Ống nghe 2 mặt tim–phổi, ống mềm chống ồn, khung hợp kim bền. Dành cho bác sĩ, điều dưỡng và sinh viên y khoa thực hành lâm sàng.",
    specs: {
      "Loại": "2 mặt",
      "Chất liệu": "Hợp kim + PVC y tế",
      "Màu": "Navy",
      "Bảo hành": "6 tháng",
    },
    seo_title: "Ống nghe y tế 2 mặt cho bác sĩ & SVY | Thiết bị Y tế Tâm Đức",
    seo_description:
      "Ống nghe y tế 2 mặt chống ồn, bền đẹp. Phù hợp phòng khám và sinh viên y — giao toàn quốc.",
  },
  {
    id: "p-07",
    name: "Đèn pin khám bệnh LED sạc USB-C",
    slug: "den-pin-kham-benh-led-usb-c",
    sku: "MED-LT-007",
    price: 220000,
    sale_price: 179000,
    category_id: "cat-3",
    images: [img("p-07"), img("p-13")],
    stock: 90,
    is_featured: false,
    description:
      "Đèn pin LED khám họng, tai mũi họng — ánh sáng trắng trung thực, pin sạc USB-C. Nhỏ gọn, dùng lâu, phù hợp túi đồ nghề bác sĩ.",
    specs: {
      "Độ sáng": "LED 3W",
      "Sạc": "USB-C",
      "Thời lượng": "3–4 giờ",
      "Bảo hành": "6 tháng",
    },
    seo_title: "Đèn pin khám bệnh LED sạc USB-C | Thiết bị Y tế Tâm Đức",
    seo_description:
      "Đèn khám LED sáng trắng, sạc USB-C tiện lợi. Dụng cụ phòng khám giá tốt tại Thiết bị Y tế Tâm Đức.",
  },
  {
    id: "p-13",
    name: "Máy hút dịch mũi điện cho trẻ em",
    slug: "may-hut-dich-mui-dien-tre-em",
    sku: "MED-SU-013",
    price: 590000,
    sale_price: 520000,
    category_id: "cat-3",
    images: [img("p-13"), img("p-02")],
    stock: 42,
    is_featured: true,
    description:
      "Máy hút dịch mũi điện, 3 mức lực hút, đầu hút mềm an toàn cho bé. Hỗ trợ thông mũi khi cảm cúm, viêm mũi — yên tâm dùng tại nhà.",
    specs: {
      "Nguồn": "Pin sạc",
      "Mức hút": "3 mức",
      "Đối tượng": "Trẻ sơ sinh – trẻ nhỏ",
      "Bảo hành": "12 tháng",
    },
    seo_title: "Máy hút dịch mũi điện an toàn cho bé | Thiết bị Y tế Tâm Đức",
    seo_description:
      "Máy hút mũi điện 3 mức hút, đầu mềm an toàn trẻ em. Giảm nghẹt mũi hiệu quả — giao nhanh.",
  },
  {
    id: "p-20",
    name: "Bộ dụng cụ khám đa năng 5 món",
    slug: "bo-dung-cu-kham-da-nang-5-mon",
    sku: "MED-KIT-020",
    price: 480000,
    sale_price: null,
    category_id: "cat-3",
    images: [img("p-20"), img("p-04")],
    stock: 38,
    is_featured: false,
    description:
      "Bộ dụng cụ khám gồm đèn, búa phản xạ, thước đo, kéo y tế — hộp đựng gọn. Phù hợp phòng khám mới mở và sinh viên thực tập.",
    specs: {
      "Số món": "5",
      "Hộp đựng": "Có",
      "Đối tượng": "Phòng khám / SVY",
      "Chất liệu": "Inox + ABS",
    },
    seo_title: "Bộ dụng cụ khám đa năng 5 món | Thiết bị Y tế Tâm Đức",
    seo_description:
      "Bộ dụng cụ khám 5 món cho phòng khám và sinh viên y. Đầy đủ, gọn nhẹ — mua tại Thiết bị Y tế Tâm Đức.",
  },
  // cat-4
  {
    id: "p-05",
    name: "Găng tay y tế nitrile không bột (hộp 100)",
    slug: "gang-tay-y-te-nitrile-hop-100",
    sku: "MED-GL-009",
    price: 245000,
    sale_price: 199000,
    category_id: "cat-4",
    images: [img("p-05"), img("p-10")],
    stock: 240,
    is_featured: true,
    description:
      "Găng nitrile không bột, đàn hồi tốt, kháng hóa chất nhẹ. Size M/L — dùng phòng khám, lab, spa y tế và chăm sóc tại nhà.",
    specs: {
      "Chất liệu": "Nitrile",
      "Số lượng": "100 chiếc",
      "Size": "M / L",
      "Bột": "Không",
    },
    seo_title: "Găng tay y tế nitrile hộp 100 không bột | Thiết bị Y tế Tâm Đức",
    seo_description:
      "Găng nitrile không bột hộp 100, size M/L. Bảo hộ y tế giá tốt — giao sỉ/lẻ toàn quốc.",
  },
  {
    id: "p-09",
    name: "Khẩu trang y tế 4 lớp kháng khuẩn (hộp 50)",
    slug: "khau-trang-y-te-4-lop-hop-50",
    sku: "MED-MS-010",
    price: 85000,
    sale_price: 69000,
    category_id: "cat-4",
    images: [img("p-09"), img("p-10")],
    stock: 400,
    is_featured: false,
    description:
      "Khẩu trang y tế 4 lớp, quai đeo êm, lọc bụi và giọt bắn. Hộp 50 chiếc — dùng hàng ngày cho gia đình, văn phòng, cơ sở y tế.",
    specs: {
      "Lớp": "4 lớp",
      "Số lượng": "50 chiếc",
      "Chuẩn": "Khẩu trang y tế",
      "Màu": "Xanh / trắng",
    },
    seo_title: "Khẩu trang y tế 4 lớp hộp 50 chiếc | Thiết bị Y tế Tâm Đức",
    seo_description:
      "Khẩu trang y tế 4 lớp hộp 50, giá sỉ. Bảo vệ hô hấp hàng ngày — mua tại Thiết bị Y tế Tâm Đức.",
  },
  {
    id: "p-10",
    name: "Khẩu trang N95 đạt chuẩn lọc ≥95% (hộp 20)",
    slug: "khau-trang-n95-hop-20",
    sku: "MED-N95-010",
    price: 280000,
    sale_price: 249000,
    category_id: "cat-4",
    images: [img("p-10"), img("p-05")],
    stock: 150,
    is_featured: true,
    description:
      "Khẩu trang N95 lọc ≥95% bụi mịn và hạt aerosol, quai chắc, ôm mặt. Phù hợp môi trường có nguy cơ lây nhiễm cao và bảo hộ lao động y tế.",
    specs: {
      "Lọc": "≥95%",
      "Số lượng": "20 chiếc",
      "Chuẩn": "N95",
      "Van thở": "Không / tùy lô",
    },
    seo_title: "Khẩu trang N95 hộp 20 chiếc đạt chuẩn | Thiết bị Y tế Tâm Đức",
    seo_description:
      "Khẩu trang N95 lọc ≥95%, hộp 20 chiếc. Bảo hộ y tế chuyên nghiệp — giao hàng toàn quốc.",
  },
  {
    id: "p-06",
    name: "Áo choàng bảo hộ y tế dùng một lần",
    slug: "ao-choang-bao-ho-y-te-mot-lan",
    sku: "MED-GW-006",
    price: 35000,
    sale_price: 29000,
    category_id: "cat-4",
    images: [img("p-06"), img("p-05")],
    stock: 500,
    is_featured: false,
    description:
      "Áo choàng bảo hộ dùng một lần, chất liệu không dệt, chống thấm nhẹ. Size Free — dùng phòng khám, thẩm mỹ viện, chăm sóc bệnh nhân.",
    specs: {
      "Loại": "Dùng 1 lần",
      "Chất liệu": "Không dệt",
      "Size": "Free size",
      "Màu": "Xanh / trắng",
    },
    seo_title: "Áo choàng bảo hộ y tế dùng một lần | Thiết bị Y tế Tâm Đức",
    seo_description:
      "Áo choàng bảo hộ y tế 1 lần, giá sỉ. Phù hợp phòng khám và cơ sở chăm sóc sức khỏe.",
  },
  // cat-5
  {
    id: "p-17",
    name: "Xe lăn nhôm cao cấp gấp gọn",
    slug: "xe-lan-nhom-cao-cap-gap-gon",
    sku: "MED-WC-015",
    price: 3200000,
    sale_price: 2890000,
    category_id: "cat-5",
    images: [img("p-17"), img("p-14")],
    stock: 18,
    is_featured: true,
    description:
      "Xe lăn khung nhôm nhẹ, gấp gọn, bánh xe êm, tải trọng 120kg. Phù hợp người cao tuổi, phục hồi sau phẫu thuật — dễ mang lên ô tô.",
    specs: {
      "Trọng lượng xe": "≈12 kg",
      "Tải trọng": "120 kg",
      "Khung": "Nhôm",
      "Bảo hành": "24 tháng",
    },
    seo_title: "Xe lăn nhôm cao cấp gấp gọn | Thiết bị Y tế Tâm Đức",
    seo_description:
      "Xe lăn nhôm nhẹ, gấp gọn, tải 120kg. Hỗ trợ người cao tuổi — giao lắp toàn quốc.",
  },
  {
    id: "p-14",
    name: "Giường y tế gấp khung thép sơn tĩnh điện",
    slug: "giuong-y-te-gap-khung-thep",
    sku: "MED-BD-014",
    price: 4500000,
    sale_price: 3990000,
    category_id: "cat-5",
    images: [img("p-14"), img("p-17")],
    stock: 12,
    is_featured: true,
    description:
      "Giường y tế gấp, khung thép sơn tĩnh điện, tải trọng 150kg, đệm kèm theo. Dùng chăm sóc bệnh nhân tại nhà hoặc cơ sở phục hồi chức năng.",
    specs: {
      "Tải trọng": "150 kg",
      "Khung": "Thép sơn tĩnh điện",
      "Gấp gọn": "Có",
      "Bảo hành": "24 tháng",
    },
    seo_title: "Giường y tế gấp khung thép tải 150kg | Thiết bị Y tế Tâm Đức",
    seo_description:
      "Giường y tế gấp chắc chắn, tải 150kg. Chăm sóc bệnh nhân tại nhà — báo giá & giao hàng.",
  },
  {
    id: "p-15",
    name: "Máy massage xung điện TENS 2 kênh",
    slug: "may-massage-xung-dien-tens-2-kenh",
    sku: "MED-TN-006",
    price: 890000,
    sale_price: 790000,
    category_id: "cat-5",
    images: [img("p-15"), img("p-16")],
    stock: 35,
    is_featured: false,
    description:
      "Máy TENS 2 kênh, nhiều chế độ xung — hỗ trợ giảm đau cơ xương khớp, đau lưng, đau vai gáy. Dùng tại nhà theo hướng dẫn vật lý trị liệu.",
    specs: {
      "Kênh": "2 kênh",
      "Chế độ": "8 modes",
      "Pin": "Sạc USB",
      "Bảo hành": "12 tháng",
    },
    seo_title: "Máy massage xung điện TENS 2 kênh | Thiết bị Y tế Tâm Đức",
    seo_description:
      "Máy TENS giảm đau cơ xương khớp tại nhà. 2 kênh, 8 chế độ — mua chính hãng tại Thiết bị Y tế Tâm Đức.",
  },
  {
    id: "p-18",
    name: "Cân sức khỏe điện tử Bluetooth đo BMI",
    slug: "can-suc-khoe-dien-tu-bluetooth-bmi",
    sku: "MED-SC-018",
    price: 450000,
    sale_price: 399000,
    category_id: "cat-5",
    images: [img("p-18"), img("p-01")],
    stock: 70,
    is_featured: false,
    description:
      "Cân điện tử kính cường lực, kết nối app Bluetooth, đo BMI và theo dõi xu hướng cân nặng. Tải trọng 180kg — phù hợp cả gia đình.",
    specs: {
      "Tải trọng": "180 kg",
      "Kết nối": "Bluetooth",
      "Mặt cân": "Kính cường lực",
      "Bảo hành": "12 tháng",
    },
    seo_title: "Cân sức khỏe điện tử Bluetooth đo BMI | Thiết bị Y tế Tâm Đức",
    seo_description:
      "Cân thông minh đo BMI, kết nối điện thoại. Theo dõi sức khỏe gia đình — giá tốt Thiết bị Y tế Tâm Đức.",
  },
];

const settings = {
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

async function main() {
  console.log("Upserting categories...");
  const { error: cErr } = await sb.from("categories").upsert(categories);
  if (cErr) throw cErr;

  console.log("Clearing old products...");
  const { error: delErr } = await sb.from("products").delete().neq("id", "__none__");
  if (delErr) throw delErr;

  console.log("Inserting products...", products.length);
  // ensure published
  const rows = products.map((p) => ({
    ...p,
    is_published: true,
  }));
  const { error: pErr } = await sb.from("products").insert(rows);
  if (pErr) throw pErr;

  // verify distribution
  for (const c of categories) {
    const n = products.filter((p) => p.category_id === c.id).length;
    console.log(`  ${c.name}: ${n} SP`);
  }

  console.log("Updating site settings...");
  const { data: srow } = await sb.from("site_settings").select("id").limit(1);
  if (srow?.[0]?.id) {
    const { error: sErr } = await sb
      .from("site_settings")
      .update(settings)
      .eq("id", srow[0].id);
    if (sErr) throw sErr;
  } else {
    const { error: sErr } = await sb.from("site_settings").insert(settings);
    if (sErr) throw sErr;
  }

  console.log("OK — catalog seeded");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
