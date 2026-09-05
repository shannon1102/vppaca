export type Branch = {
  name: string;
  address: string;
  mapsUrl: string;
  embedUrl?: string;
};

export const TAM_DUC_BRAND = {
  legalName: "Công ty TNHH Dịch vụ Y khoa - Cổ truyền Tâm Đức",
  taxCode: "0111502541",
  hours: "8:00 – 19:00 (T2–CN)",
  branches: [
    {
      name: "Cơ sở 1 — Nguyễn Viết Xuân",
      address: "Số 200, Nguyễn Viết Xuân, Hà Cầu, Hà Đông, Hà Nội",
      mapsUrl:
        "https://www.google.com/maps/search/?api=1&query=200+Nguy%E1%BB%85n+Vi%E1%BA%BFt+Xu%C3%A2n+H%C3%A0+%C4%90%C3%B4ng+H%C3%A0+N%E1%BB%99i",
    },
    {
      name: "Cơ sở 2 — Làng Việt Kiều",
      address: "Số 18, LK06A, Làng Việt Kiều, Mỗ Lao, Hà Đông, Hà Nội",
      mapsUrl:
        "https://www.google.com/maps/place/Trung+T%C3%A2m+Tr%E1%BB%8B+Li%E1%BB%87u+C%E1%BB%95+Truy%E1%BB%81n+T%C3%A2m+%C4%90%E1%BB%A9c/@20.9856076,105.7866301,17z",
      embedUrl:
        "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3725.0!2d105.7866301!3d20.9856076!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ada8f04acf23%3A0xc29834a16788fc29!2zVHJ1bmcgVMOibSBUcuG4gTOi4buHIEPhuW5nIFRy4bqnbiBUw6JtIMSR4bukYw!5e0!3m2!1svi!2s!4v1",
    },
  ] satisfies Branch[],
  footerDescription:
    "Thiết bị Y tế Tâm Đức — cửa hàng thiết bị y tế Hà Nội (Hà Đông). Đồng hành cùng gia đình Việt với thiết bị y tế chính hãng, tư vấn tận tâm và giao hàng toàn quốc.",
  heroDescription:
    "Thiết bị Y tế Tâm Đức cung cấp thiết bị y tế chính hãng tại Hà Nội cho gia đình, phòng khám và cơ sở chăm sóc sức khỏe. Đặt hàng online, thanh toán chuyển khoản kèm QR — tư vấn miễn phí qua hotline.",
  /** Homepage hero — Unsplash, see public/brand/CREDITS.md */
  heroImage: "/brand/hero-candidate-hospital.jpg",
  heroImageAlt: "Thiết bị theo dõi bệnh nhân trong phòng y tế hiện đại",
  aboutIntro:
    "Thiết bị Y tế Tâm Đức là đơn vị cung cấp thiết bị y tế và dụng cụ y tế tại Hà Nội, Hà Đông. Thuộc hệ sinh thái Tâm Đức với kinh nghiệm lâu năm trong chăm sóc sức khỏe cộng đồng — nơi khách hàng tìm kiếm thiết bị y tế uy tín, chính hãng.",
  aboutServices: [
    "Máy đo sức khỏe (huyết áp, đường huyết, SpO2, nhiệt kế) — thiết bị y tế gia đình",
    "Thiết bị phòng khám & phục hồi chức năng tại Hà Nội",
    "Dụng cụ chăm sóc vết thương, bảo hộ y tế",
    "Tư vấn chọn thiết bị y tế phù hợp nhu cầu gia đình và phòng khám",
  ],
  aboutCommitment:
    "Cam kết của Thiết bị Y tế Tâm Đức: hàng chính hãng, bảo hành rõ ràng, giao hàng toàn quốc từ cơ sở Hà Đông, Hà Nội.",
  seoKeywords: [
    "Thiết bị Y tế Tâm Đức",
    "Thiết bị Y tế",
    "Thiết bị Y tế Hà Nội",
    "Thiết bị y tế Hà Đông",
    "cửa hàng thiết bị y tế Hà Nội",
  ],
  social: {
    zalo: "https://zalo.me/0935883361",
    facebook: "https://www.facebook.com/profile.php?id=61561988987352",
    messenger: "https://m.me/61561988987352",
  },
} as const;
