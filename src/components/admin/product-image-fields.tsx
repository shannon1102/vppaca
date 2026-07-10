"use client";

import Image from "next/image";
import { useCallback, useState } from "react";
import { uploadImageFile } from "@/lib/media/client-upload";

type Props = {
  defaultImages?: string[];
};

export function ProductImageFields({ defaultImages = [] }: Props) {
  const [images, setImages] = useState<string[]>(
    defaultImages.length ? defaultImages : [""],
  );
  const [urlInput, setUrlInput] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const mainImage = images[0] || "";
  const galleryImages = images.slice(1);

  const updateImages = useCallback((next: string[]) => {
    setImages(next.filter((u, i) => u.trim() || i === 0));
  }, []);

  const setMainImage = (url: string) => {
    const rest = images.slice(1).filter(Boolean);
    updateImages([url, ...rest]);
  };

  const addGalleryUrl = () => {
    const url = urlInput.trim();
    if (!url) return;
    updateImages([...images.filter(Boolean), url]);
    setUrlInput("");
  };

  const uploadFiles = async (files: FileList | File[], asMain: boolean) => {
    setError("");
    setUploading(true);
    try {
      const list = Array.from(files);
      const urls: string[] = [];
      for (const file of list) {
        urls.push(await uploadImageFile(file));
      }
      if (asMain && urls[0]) {
        const rest = images.slice(1).filter(Boolean);
        updateImages([urls[0], ...rest, ...urls.slice(1)]);
      } else {
        updateImages([...images.filter(Boolean), ...urls]);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload ảnh thất bại");
    } finally {
      setUploading(false);
    }
  };

  const removeAt = (index: number) => {
    const next = images.filter((_, i) => i !== index);
    updateImages(next.length ? next : [""]);
  };

  const moveGallery = (index: number, dir: -1 | 1) => {
    const gi = index + 1;
    const target = gi + dir;
    if (target < 1 || target >= images.length) return;
    const next = [...images];
    [next[gi], next[target]] = [next[target], next[gi]];
    updateImages(next);
  };

  const hiddenValue = images.map((u) => u.trim()).filter(Boolean).join("\n");

  return (
    <div className="space-y-4">
      <input type="hidden" name="images" value={hiddenValue} />

      <div className="space-y-2">
        <span className="text-sm font-medium">Ảnh chính</span>
        <div className="flex flex-wrap items-start gap-4">
          {mainImage ? (
            <div className="relative h-28 w-28 overflow-hidden rounded-lg border border-slate-200 bg-white">
              <Image src={mainImage} alt="" fill className="object-cover" sizes="112px" />
            </div>
          ) : (
            <div className="flex h-28 w-28 items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50 text-xs text-[var(--brand-muted)]">
              Chưa có ảnh
            </div>
          )}
          <div className="min-w-0 flex-1 space-y-2">
            <input
              type="url"
              value={mainImage}
              onChange={(e) => setMainImage(e.target.value)}
              placeholder="URL ảnh chính"
              className="w-full rounded-[var(--radius)] border border-slate-200 px-3 py-2 text-sm"
            />
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-[var(--radius)] border border-slate-200 bg-white px-3 py-2 text-sm hover:bg-slate-50">
              <input
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp"
                className="hidden"
                disabled={uploading}
                onChange={(e) => {
                  const files = e.target.files;
                  if (files?.length) void uploadFiles(files, true);
                  e.target.value = "";
                }}
              />
              {uploading ? "Đang tải..." : "Tải ảnh chính lên"}
            </label>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <span className="text-sm font-medium">Ảnh phụ (gallery)</span>
        <div className="flex flex-wrap gap-2">
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-[var(--radius)] border border-slate-200 bg-white px-3 py-2 text-sm hover:bg-slate-50">
            <input
              type="file"
              accept="image/jpeg,image/png,image/gif,image/webp"
              multiple
              className="hidden"
              disabled={uploading}
              onChange={(e) => {
                const files = e.target.files;
                if (files?.length) void uploadFiles(files, false);
                e.target.value = "";
              }}
            />
            Tải nhiều ảnh
          </label>
          <input
            type="url"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addGalleryUrl();
              }
            }}
            placeholder="Hoặc dán URL rồi Enter"
            className="min-w-[200px] flex-1 rounded-[var(--radius)] border border-slate-200 px-3 py-2 text-sm"
          />
          <button
            type="button"
            onClick={addGalleryUrl}
            className="rounded-[var(--radius)] border border-slate-200 bg-white px-3 py-2 text-sm hover:bg-slate-50"
          >
            Thêm URL
          </button>
        </div>

        {galleryImages.length > 0 ? (
          <ul className="mt-2 space-y-2">
            {galleryImages.map((src, i) => (
              <li
                key={`${src}-${i}`}
                className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-2"
              >
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded border border-slate-100">
                  {src ? (
                    <Image src={src} alt="" fill className="object-cover" sizes="56px" />
                  ) : null}
                </div>
                <input
                  type="url"
                  value={src}
                  onChange={(e) => {
                    const next = [...images];
                    next[i + 1] = e.target.value;
                    setImages(next);
                  }}
                  className="min-w-0 flex-1 rounded border border-slate-200 px-2 py-1 text-xs"
                />
                <div className="flex shrink-0 gap-1">
                  <button
                    type="button"
                    title="Lên"
                    onClick={() => moveGallery(i, -1)}
                    className="rounded border border-slate-200 px-2 py-1 text-xs hover:bg-slate-50"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    title="Xuống"
                    onClick={() => moveGallery(i, 1)}
                    className="rounded border border-slate-200 px-2 py-1 text-xs hover:bg-slate-50"
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    onClick={() => removeAt(i + 1)}
                    className="rounded border border-red-200 px-2 py-1 text-xs text-red-600 hover:bg-red-50"
                  >
                    Xóa
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-xs text-[var(--brand-muted)]">Chưa có ảnh phụ.</p>
        )}
      </div>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}
    </div>
  );
}
