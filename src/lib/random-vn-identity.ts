const SURNAMES = [
  "Nguyễn",
  "Trần",
  "Lê",
  "Phạm",
  "Hoàng",
  "Huỳnh",
  "Phan",
  "Vũ",
  "Võ",
  "Đặng",
  "Bùi",
  "Đỗ",
  "Hồ",
  "Ngô",
  "Dương",
  "Lý",
];

const MIDDLE_NAMES = [
  "Văn",
  "Thị",
  "Hữu",
  "Minh",
  "Quốc",
  "Thanh",
  "Ngọc",
  "Xuân",
  "Kim",
  "Bảo",
  "Gia",
  "Anh",
  "Tuấn",
  "Hồng",
  "Thu",
];

const GIVEN_NAMES = [
  "An",
  "Bình",
  "Chi",
  "Dũng",
  "Hà",
  "Hải",
  "Hùng",
  "Hương",
  "Khang",
  "Lan",
  "Linh",
  "Long",
  "Mai",
  "Nam",
  "Phúc",
  "Quân",
  "Sơn",
  "Tài",
  "Trang",
  "Tú",
  "Vy",
  "Yến",
];

function pick<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)]!;
}

export function randomVietnameseName(): string {
  const surname = pick(SURNAMES);
  const useMiddle = Math.random() > 0.35;
  if (useMiddle) {
    return `${surname} ${pick(MIDDLE_NAMES)} ${pick(GIVEN_NAMES)}`;
  }
  return `${surname} ${pick(GIVEN_NAMES)}`;
}

/** Vietnamese mobile: 0 + 9 digits, middle 4 digits masked as xxxx */
export function randomMaskedPhone(): string {
  const prefixes = ["32", "33", "34", "35", "36", "37", "38", "39", "70", "76", "77", "78", "79", "81", "82", "83", "84", "85", "86", "88", "89", "90", "91", "92", "93", "94", "96", "97", "98", "99"];
  const prefix = pick(prefixes);
  const suffix = String(Math.floor(Math.random() * 1000)).padStart(3, "0");
  return `0${prefix}xxxx${suffix}`;
}
