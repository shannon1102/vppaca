/** Resize / compress large photos before upload (keeps GIFs as-is). */
export async function prepareImageForUpload(file: File): Promise<File> {
  if (!file.type.startsWith("image/") || file.type === "image/gif") {
    return file;
  }

  const MAX_EDGE = 1920;
  const TARGET_BYTES = 1.2 * 1024 * 1024;

  if (file.size <= TARGET_BYTES) {
    // Still clamp huge dimensions even if file is under target.
    try {
      const bmp = await createImageBitmap(file);
      if (bmp.width <= MAX_EDGE && bmp.height <= MAX_EDGE) {
        bmp.close();
        return file;
      }
      bmp.close();
    } catch {
      return file;
    }
  }

  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
    const w = Math.max(1, Math.round(bitmap.width * scale));
    const h = Math.max(1, Math.round(bitmap.height * scale));
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      bitmap.close();
      return file;
    }
    ctx.drawImage(bitmap, 0, 0, w, h);
    bitmap.close();

    const preferWebp = file.type === "image/webp" || file.type === "image/png";
    const mime = preferWebp ? "image/webp" : "image/jpeg";
    const quality = file.size > 3 * 1024 * 1024 ? 0.72 : 0.82;

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, mime, quality),
    );
    if (!blob || blob.size >= file.size) return file;

    const ext = mime === "image/webp" ? "webp" : "jpg";
    const base = file.name.replace(/\.[^.]+$/, "") || "image";
    return new File([blob], `${base}.${ext}`, { type: mime });
  } catch {
    return file;
  }
}
