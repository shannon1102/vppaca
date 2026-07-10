"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import Quill from "quill";
import "react-quill-new/dist/quill.snow.css";
import { uploadImageFile } from "@/lib/media/client-upload";

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

type Props = {
  name: string;
  label?: string;
  defaultValue?: string;
  height?: number;
};

export function RichTextEditorInner({
  name,
  label,
  defaultValue = "",
  height = 360,
}: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const boundRef = useRef(false);
  const uploadingRef = useRef<Set<string>>(new Set());
  const [value, setValue] = useState(defaultValue);
  const [uploading, setUploading] = useState(false);

  const syncFromEditor = useCallback(() => {
    const quill = getQuillFromWrapper(wrapRef.current);
    if (quill?.root.innerHTML != null) setValue(quill.root.innerHTML);
  }, []);

  const replaceBase64Images = useCallback(async () => {
    const quill = getQuillFromWrapper(wrapRef.current);
    if (!quill) return;

    const imgs = quill.root.querySelectorAll('img[src^="data:"]');
    if (!imgs.length) return;

    setUploading(true);
    try {
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
      syncFromEditor();
    } finally {
      setUploading(false);
    }
  }, [syncFromEditor]);

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
          setUploading(true);
          try {
            const url = await uploadImageFile(file);
            quill.insertEmbed(range.index, "image", url);
            quill.setSelection(range.index + 1);
            syncFromEditor();
          } catch (e) {
            alert(e instanceof Error ? e.message : "Upload ảnh thất bại");
          } finally {
            setUploading(false);
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
        setUploading(true);

        try {
          for (const item of imageItems) {
            const file = item.getAsFile();
            if (!file) continue;
            const url = await uploadImageFile(file);
            quill.insertEmbed(idx, "image", url);
            idx += 1;
          }
          quill.setSelection(idx);
          syncFromEditor();
        } catch (err) {
          alert(err instanceof Error ? err.message : "Dán ảnh thất bại");
        } finally {
          setUploading(false);
        }
      };

      quill.root.addEventListener("paste", onPaste, true);
      quill.on("text-change", () => {
        void replaceBase64Images();
      });
    },
    [replaceBase64Images, syncFromEditor],
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

  useEffect(() => {
    const form = wrapRef.current?.closest("form");
    if (!form) return;

    const onSubmit = (e: Event) => {
      if (uploading) {
        e.preventDefault();
        e.stopPropagation();
        alert("Vui lòng đợi ảnh tải lên xong trước khi lưu.");
        return;
      }
      syncFromEditor();
    };

    form.addEventListener("submit", onSubmit, true);
    return () => form.removeEventListener("submit", onSubmit, true);
  }, [uploading, syncFromEditor]);

  return (
    <label className="block space-y-1.5 text-sm">
      {label ? <span className="font-medium">{label}</span> : null}
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
            const quill = getQuillFromWrapper(wrapRef.current);
            if (quill) bindQuillHandlers(quill);
          }}
          modules={{ toolbar }}
          placeholder="Nhập nội dung — có thể dán ảnh trực tiếp (Ctrl+V)"
        />
      </div>
      <input type="hidden" name={name} value={value} />
    </label>
  );
}
