import { saveUploadedImage } from "@/lib/media/upload";

const DATA_SRC_RE =
  /src=["'](data:image\/(?:jpeg|png|gif|webp);base64,[^"']+)["']/gi;

function dataUrlToFile(dataUrl: string): File {
  const m = dataUrl.match(/^data:(image\/(?:jpeg|png|gif|webp));base64,(.+)$/i);
  if (!m) throw new Error("Invalid image data URL");
  const mime = m[1].toLowerCase();
  const buffer = Buffer.from(m[2], "base64");
  const ext = mime.split("/")[1] === "jpeg" ? "jpg" : mime.split("/")[1];
  return new File([buffer], `inline.${ext}`, { type: mime });
}

/** Upload inline base64 images in rich HTML and replace with permanent URLs. */
export async function persistRichHtmlImages(html: string): Promise<string> {
  if (!html.includes("data:image/")) return html;

  const dataUrls = new Set<string>();
  for (const match of html.matchAll(DATA_SRC_RE)) {
    dataUrls.add(match[1]);
  }
  if (!dataUrls.size) return html;

  let result = html;
  for (const dataUrl of dataUrls) {
    try {
      const file = dataUrlToFile(dataUrl);
      const media = await saveUploadedImage(file);
      result = result.split(dataUrl).join(media.url);
    } catch {
      result = result.split(`src="${dataUrl}"`).join("");
      result = result.split(`src='${dataUrl}'`).join("");
    }
  }
  return result;
}
