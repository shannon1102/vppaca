/** Client-side image upload for admin forms. */
export async function uploadImageFile(file: File): Promise<string> {
  const fd = new FormData();
  fd.append("file", file);
  const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
  const json = (await res.json()) as { data?: { url: string }; error?: string };
  if (!res.ok || !json.data?.url) {
    throw new Error(json.error || "Upload ảnh thất bại");
  }
  return json.data.url;
}
