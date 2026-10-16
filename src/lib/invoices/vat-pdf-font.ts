let cachedRegular: ArrayBuffer | null = null;
let cachedBold: ArrayBuffer | null = null;

const NOTO_REG =
  "https://raw.githubusercontent.com/googlefonts/noto-fonts/main/hinted/ttf/NotoSans/NotoSans-Regular.ttf";
const NOTO_BOLD =
  "https://raw.githubusercontent.com/googlefonts/noto-fonts/main/hinted/ttf/NotoSans/NotoSans-Bold.ttf";

async function fetchFont(url: string): Promise<ArrayBuffer> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Font fetch failed: ${url}`);
  return res.arrayBuffer();
}

export async function getNotoSansRegular(): Promise<ArrayBuffer> {
  if (!cachedRegular) cachedRegular = await fetchFont(NOTO_REG);
  return cachedRegular;
}

export async function getNotoSansBold(): Promise<ArrayBuffer> {
  if (!cachedBold) cachedBold = await fetchFont(NOTO_BOLD);
  return cachedBold;
}
