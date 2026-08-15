"use client";

import Image from "next/image";
import { useState } from "react";
import { uploadImageFile } from "@/lib/media/client-upload";

type Props = {
  defaultValue?: string | null;
};

export function CategoryImageField({ defaultValue = "" }: Props) {
  const [imageUrl, setImageUrl] = useState(defaultValue ?? "");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const uploadFile = async (file: File) => {
    setError("");
    setUploading(true);
    try {
      const url = await uploadImageFile(file);
      setImageUrl(url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload ảnh thất bại");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <span className="text-sm font-medium">Ảnh danh mục</span>
      <input type="hidden" name="image_url" value={imageUrl} />
      <div className="flex flex-wrap items-start gap-4">
        {imageUrl ? (
          <div className="relative h-28 w-44 overflow-hidden rounded-lg border border-slate-200 bg-white">
            <Image src={imageUrl} alt="" fill className="object-cover" sizes="176px" />
          </div>
        ) : (
          <div className="flex h-28 w-44 items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50 text-xs text-[var(--brand-muted)]">
            Chưa có ảnh
          </div>
        )}
        <div className="min-w-0 flex-1 space-y-2">
          <input
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="Hoặc dán URL ảnh"
            className="w-full rounded-[var(--radius)] border border-slate-200 px-3 py-2 text-sm"
          />
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-[var(--radius)] border border-slate-200 bg-white px-3 py-2 text-sm hover:bg-slate-50">
            <input
              type="file"
              accept="image/jpeg,image/png,image/gif,image/webp"
              className="hidden"
              disabled={uploading}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) void uploadFile(file);
                e.target.value = "";
              }}
            />
            {uploading ? "Đang tải..." : "Tải ảnh lên"}
          </label>
          {imageUrl ? (
            <button
              type="button"
              onClick={() => setImageUrl("")}
              className="text-xs text-red-600 hover:underline"
            >
              Xóa ảnh
            </button>
          ) : null}
        </div>
      </div>
      <p className="text-xs text-[var(--brand-muted)]">
        Ảnh hiển thị trên trang chủ và trang danh mục sản phẩm. Ảnh mỗi file ≤ 5MB
        (JPG/PNG/GIF/WEBP, tự nén khi tải lên).
      </p>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
    </div>
  );
}
