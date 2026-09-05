"use client";

import Image from "next/image";
import { useState } from "react";
import { uploadImageFile } from "@/lib/media/client-upload";

type Props = {
  defaultValue?: string | null;
};

export function ArticleCoverField({ defaultValue = "" }: Props) {
  const [coverUrl, setCoverUrl] = useState(defaultValue ?? "");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const uploadFile = async (file: File) => {
    setError("");
    setUploading(true);
    try {
      const url = await uploadImageFile(file);
      setCoverUrl(url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload ảnh thất bại");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <span className="text-sm font-medium">Ảnh bìa (thumbnail)</span>
      <input type="hidden" name="cover_image_url" value={coverUrl} />
      <div className="flex flex-wrap items-start gap-4">
        {coverUrl ? (
          <div className="relative aspect-video w-44 overflow-hidden rounded-lg border border-slate-200 bg-white">
            <Image src={coverUrl} alt="" fill className="object-cover" sizes="176px" />
          </div>
        ) : (
          <div className="flex aspect-video w-44 items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50 text-xs text-[var(--brand-muted)]">
            Chưa có ảnh
          </div>
        )}
        <div className="min-w-0 flex-1 space-y-2">
          <input
            type="url"
            value={coverUrl}
            onChange={(e) => setCoverUrl(e.target.value)}
            placeholder="URL ảnh bìa"
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
            {uploading ? "Đang tải..." : "Tải ảnh bìa lên"}
          </label>
          {coverUrl ? (
            <button
              type="button"
              onClick={() => setCoverUrl("")}
              className="text-xs text-red-600 hover:underline"
            >
              Xóa ảnh bìa
            </button>
          ) : null}
        </div>
      </div>
      <p className="text-xs text-[var(--brand-muted)]">
        Tỷ lệ khuyến nghị 16:9 (vd. 1280×720 hoặc 1920×1080). Ảnh hiển thị trên
        danh sách và trang chi tiết bài viết. Mỗi file ≤ 5MB (JPG/PNG/GIF/WEBP,
        tự nén khi tải lên).
      </p>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
    </div>
  );
}
