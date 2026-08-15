"use client";

import dynamic from "next/dynamic";

const RichTextEditorInner = dynamic(
  () => import("@/components/ui/rich-text-editor-inner").then((m) => m.RichTextEditorInner),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-48 items-center justify-center rounded-[var(--radius)] border border-slate-200 bg-slate-50 text-sm text-[var(--brand-muted)]">
        Đang tải trình soạn thảo...
      </div>
    ),
  },
);

type Props = {
  name: string;
  label?: string;
  defaultValue?: string;
  height?: number;
  maxLength?: number;
};

export function RichTextEditor(props: Props) {
  return <RichTextEditorInner {...props} />;
}
