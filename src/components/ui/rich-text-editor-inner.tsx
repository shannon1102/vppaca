"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import Quill from "quill";
import "react-quill-new/dist/quill.snow.css";
import { uploadImageFile } from "@/lib/media/client-upload";
import {
  FORM_LIMITS,
  formatImageLimit,
  formatRichHtmlLimit,
  hasDataImages,
  stripDataImages,
} from "@/lib/form-limits";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

const toolbar = [
  [{ header: [1, 2, 3, false] }],
  ["bold", "italic", "underline", "strike"],
  ["blockquote", "code-block"],
  [{ list: "ordered" }, { list: "bullet" }],
  [{ align: [] }],
  ["link", "image"],
  ["clean"],
];

type QuillInstance = {
  root: HTMLElement;
  getSelection: (focus?: boolean) => { index: number; length: number } | null;
  insertEmbed: (index: number, type: string, value: string) => void;
  setSelection: (index: number) => void;
  getModule: (name: string) => unknown;
  on: (event: string, handler: () => void) => void;
};

function getQuillFromWrapper(wrapper: HTMLElement | null): QuillInstance | null {
  if (!wrapper) return null;
  const editor = wrapper.querySelector(".ql-editor");
  if (!editor) return null;
  return Quill.find(editor) as QuillInstance | null;
}

function safeHtmlForSubmit(html: string): string | null {
  const cleaned = stripDataImages(html);
  if (hasDataImages(cleaned)) return null;
  if (cleaned.length > FORM_LIMITS.richHtml) return null;
  return cleaned;
}

type Props = {
  name: string;
  label?: string;
  defaultValue?: string;
  height?: number;
  maxLength?: number;
};

export function RichTextEditorInner({
  name,
  label,
  defaultValue = "",
  height = 360,
  maxLength = FORM_LIMITS.richHtml,
}: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const hiddenRef = useRef<HTMLInputElement>(null);
  const boundRef = useRef(false);
  const uploadingRef = useRef<Set<string>>(new Set());
  const busyRef = useRef(false);
  const allowNativeSubmitRef = useRef(false);
  const [value, setValue] = useState(defaultValue);
  const [uploading, setUploading] = useState(false);
  const [charCount, setCharCount] = useState(defaultValue.length);

  const setBusy = useCallback((busy: boolean) => {
    busyRef.current = busy;
    setUploading(busy);
  }, []);

  /** Never write base64 into the form field — that caused HTTP 413 (~5MB+). */
  const flushEditorToHidden = useCallback(() => {
    const quill = getQuillFromWrapper(wrapRef.current);
    const raw = quill?.root.innerHTML ?? "";
    setValue(raw);
    setCharCount(raw.length);

    if (hasDataImages(raw)) {
      return raw;
    }
    if (hiddenRef.current) {
      hiddenRef.current.value = raw.length > maxLength ? raw.slice(0, maxLength) : raw;
    }
    return raw;
  }, [maxLength]);

  const uploadPendingBase64 = useCallback(async () => {
    const quill = getQuillFromWrapper(wrapRef.current);
    if (!quill) return;

    const imgs = quill.root.querySelectorAll('img[src^="data:"]');
    if (!imgs.length) return;

    for (const img of Array.from(imgs)) {
      const src = img.getAttribute("src");
      if (!src || uploadingRef.current.has(src)) continue;
      uploadingRef.current.add(src);

      try {
        const blob = await fetch(src).then((r) => r.blob());
        const ext = blob.type.split("/")[1] || "png";
        const file = new File([blob], `paste.${ext}`, {
          type: blob.type || "image/png",
        });
        const url = await uploadImageFile(file);
        img.setAttribute("src", url);
      } catch {
        img.remove();
      } finally {
        uploadingRef.current.delete(src);
      }
    }
    flushEditorToHidden();
  }, [flushEditorToHidden]);

  const replaceBase64Images = useCallback(async () => {
    const quill = getQuillFromWrapper(wrapRef.current);
    if (!quill?.root.querySelector('img[src^="data:"]')) return;
    if (busyRef.current) {
      await uploadPendingBase64();
      return;
    }
    setBusy(true);
    try {
      await uploadPendingBase64();
    } finally {
      setBusy(false);
    }
  }, [setBusy, uploadPendingBase64]);

  const bindQuillHandlers = useCallback(
    (quill: QuillInstance) => {
      if (boundRef.current) return;
      boundRef.current = true;

      const toolbarModule = quill.getModule("toolbar") as {
        addHandler: (name: string, fn: () => void) => void;
      };

      toolbarModule.addHandler("image", () => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/jpeg,image/png,image/gif,image/webp";
        input.onchange = async () => {
          const file = input.files?.[0];
          if (!file) return;
          const range = quill.getSelection(true);
          if (!range) return;
          setBusy(true);
          try {
            const url = await uploadImageFile(file);
            quill.insertEmbed(range.index, "image", url);
            quill.setSelection(range.index + 1);
            flushEditorToHidden();
          } catch (e) {
            alert(e instanceof Error ? e.message : "Upload ảnh thất bại");
          } finally {
            setBusy(false);
          }
        };
        input.click();
      });

      const onPaste = async (e: ClipboardEvent) => {
        const items = e.clipboardData?.items;
        if (!items) return;

        const imageItems = Array.from(items).filter((i) =>
          i.type.startsWith("image/"),
        );
        if (!imageItems.length) return;

        e.preventDefault();
        e.stopPropagation();

        const range = quill.getSelection(true);
        if (!range) return;
        let idx = range.index;
        setBusy(true);

        try {
          for (const item of imageItems) {
            const file = item.getAsFile();
            if (!file) continue;
            const url = await uploadImageFile(file);
            quill.insertEmbed(idx, "image", url);
            idx += 1;
          }
          quill.setSelection(idx);
          flushEditorToHidden();
        } catch (err) {
          alert(err instanceof Error ? err.message : "Dán ảnh thất bại");
        } finally {
          setBusy(false);
        }
      };

      quill.root.addEventListener("paste", onPaste, true);
      quill.on("text-change", () => {
        void replaceBase64Images();
        const html = quill.root.innerHTML;
        setCharCount(html.length);
        if (!hasDataImages(html) && hiddenRef.current) {
          hiddenRef.current.value =
            html.length > maxLength ? html.slice(0, maxLength) : html;
        }
      });
    },
    [flushEditorToHidden, maxLength, replaceBase64Images, setBusy],
  );

  useEffect(() => {
    const timer = window.setInterval(() => {
      const quill = getQuillFromWrapper(wrapRef.current);
      if (quill) {
        bindQuillHandlers(quill);
        void replaceBase64Images();
        window.clearInterval(timer);
      }
    }, 100);
    return () => window.clearInterval(timer);
  }, [bindQuillHandlers, replaceBase64Images]);

  // Block Chrome/Google default right-click menu inside the editor + toolbar
  // (interferes when aligning headings / using Quill pickers).
  useEffect(() => {
    const root = wrapRef.current;
    if (!root) return;
    const onContextMenu = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
    };
    root.addEventListener("contextmenu", onContextMenu, true);
    return () => root.removeEventListener("contextmenu", onContextMenu, true);
  }, []);

  useEffect(() => {
    const form = wrapRef.current?.closest("form");
    if (!form) return;

    const onSubmit = (e: Event) => {
      if (allowNativeSubmitRef.current) {
        allowNativeSubmitRef.current = false;
        const html = flushEditorToHidden();
        const safe = safeHtmlForSubmit(html);
        if (!safe || !hiddenRef.current) {
          e.preventDefault();
          e.stopPropagation();
          alert(
            "Nội dung vẫn chứa ảnh chưa upload hoặc vượt giới hạn. Vui lòng thử lại.",
          );
          return;
        }
        hiddenRef.current.value = safe;
        return;
      }

      e.preventDefault();
      e.stopPropagation();

      if (busyRef.current) {
        alert("Vui lòng đợi ảnh tải lên xong trước khi lưu.");
        return;
      }

      void (async () => {
        setBusy(true);
        try {
          await uploadPendingBase64();
          for (let i = 0; i < 50 && uploadingRef.current.size > 0; i++) {
            await new Promise((r) => setTimeout(r, 100));
          }
          const html = flushEditorToHidden();
          const safe = safeHtmlForSubmit(html);
          if (!safe) {
            if (html.length > maxLength) {
              alert(
                `Nội dung vượt quá ${maxLength.toLocaleString("vi-VN")} ký tự. Hãy rút ngắn bài viết.`,
              );
            } else {
              alert(
                "Một số ảnh chưa tải lên được. Dùng nút Image trên thanh công cụ hoặc ảnh ≤ 5MB.",
              );
            }
            return;
          }
          if (hiddenRef.current) hiddenRef.current.value = safe;

          const approxBytes = new Blob([safe]).size;
          if (approxBytes > FORM_LIMITS.requestBodyBytes * 0.85) {
            alert(
              "Nội dung quá lớn để lưu qua form (giới hạn ~4MB). Hãy rút ngắn bài hoặc giảm số ảnh trong nội dung.",
            );
            return;
          }

          allowNativeSubmitRef.current = true;
          if (typeof form.requestSubmit === "function") {
            form.requestSubmit();
          } else {
            form.dispatchEvent(
              new Event("submit", { cancelable: true, bubbles: true }),
            );
          }
        } finally {
          setBusy(false);
        }
      })();
    };

    form.addEventListener("submit", onSubmit, true);
    return () => form.removeEventListener("submit", onSubmit, true);
  }, [flushEditorToHidden, maxLength, setBusy, uploadPendingBase64]);

  const overLimit = charCount > maxLength;

  return (
    <label className="block space-y-1.5 text-sm">
      {label ? (
        <span className="flex items-baseline justify-between gap-2 font-medium">
          <span>{label}</span>
          <span
            className={
              overLimit
                ? "text-xs font-normal text-red-600"
                : "text-xs font-normal text-[var(--brand-muted)]"
            }
          >
            {charCount.toLocaleString("vi-VN")}/{maxLength.toLocaleString("vi-VN")}
          </span>
        </span>
      ) : null}
      {uploading ? (
        <p className="text-xs text-[var(--brand-primary)]">Đang tải ảnh lên...</p>
      ) : null}
      <div
        ref={wrapRef}
        className="rich-text-editor overflow-hidden rounded-[var(--radius)] border border-slate-200 bg-white"
        style={{ ["--editor-height" as string]: `${height}px` }}
      >
        <ReactQuill
          theme="snow"
          value={value}
          onChange={(html) => {
            setValue(html);
            setCharCount(html.length);
            if (hiddenRef.current && !hasDataImages(html)) {
              hiddenRef.current.value =
                html.length > maxLength ? html.slice(0, maxLength) : html;
            }
            const quill = getQuillFromWrapper(wrapRef.current);
            if (quill) bindQuillHandlers(quill);
          }}
          modules={{ toolbar }}
          placeholder="Nhập nội dung — dán ảnh (Ctrl+V) sẽ tự upload; không gửi ảnh base64 trong form"
        />
      </div>
      <input
        ref={hiddenRef}
        type="hidden"
        name={name}
        defaultValue={hasDataImages(defaultValue) ? stripDataImages(defaultValue) : defaultValue}
      />
      <span className="block text-xs text-[var(--brand-muted)]">
        {formatRichHtmlLimit()} · {formatImageLimit()}
      </span>
    </label>
  );
}
