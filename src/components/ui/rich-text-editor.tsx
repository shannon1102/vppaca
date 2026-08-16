"use client";

import dynamic from "next/dynamic";

const RichTextEditorInner = dynamic(
  () => import("@/components/ui/rich-text-editor-inner").then((m) => m.RichTextEditorInner),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[min(65vh,48rem)] min-h-[20rem] items-center justify-center rounded-[var(--radius)] border border-slate-200 bg-slate-50 text-sm text-[var(--brand-muted)]">
        Đang tải trình soạn thảo...
      </div>
    ),
  },
);

type Props = {
  name: string;
  label?: string;
  defaultValue?: string;
  /**
   * Editor shell height. Number = px.
   * String = any CSS length (e.g. "70%", "65vh", "min(65vh, 48rem)").
   * Percent is relative to the parent; parent should have an explicit height.
   */
  height?: number | string;
  /** Shortcut: height as % of parent (e.g. 70 → "70%"). Overrides `height` when set. */
  heightPercent?: number;
  maxLength?: number;
};

export function RichTextEditor(props: Props) {
  return <RichTextEditorInner {...props} />;
}
