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

const AVATAR_COLORS = [
  { bg: "#E8F5E9", text: "#2E7D32" },
  { bg: "#E3F2FD", text: "#1565C0" },
  { bg: "#FFF3E0", text: "#E65100" },
  { bg: "#F3E5F5", text: "#7B1FA2" },
  { bg: "#FCE4EC", text: "#C2185B" },
  { bg: "#E0F2F1", text: "#00695C" },
];

export function nameInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "?";
  const given = parts[parts.length - 1]!;
  return given.charAt(0).toLocaleUpperCase("vi-VN");
}

export function avatarColorsForName(name: string): { bg: string; text: string } {
  let hash = 0;
  for (const ch of name) hash = (hash + ch.charCodeAt(0)) % 997;
  return AVATAR_COLORS[hash % AVATAR_COLORS.length]!;
}
