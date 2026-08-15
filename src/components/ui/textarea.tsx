"use client";

import { useId, useState } from "react";
import { cn } from "@/lib/cn";
import { formatCharLimit } from "@/lib/form-limits";

type Props = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
  error?: string;
  hint?: string;
  showLimit?: boolean;
  showCount?: boolean;
};

export function Textarea({
  label,
  error,
  hint,
  showLimit = true,
  showCount = true,
  className,
  id,
  maxLength,
  defaultValue,
  value,
  onChange,
  ...props
}: Props) {
  const autoId = useId();
  const inputId = id ?? props.name ?? autoId;
  const isControlled = value !== undefined;
  const [inner, setInner] = useState(String(defaultValue ?? ""));
  const current = isControlled ? String(value) : inner;
  const limitHint =
    showLimit && typeof maxLength === "number"
      ? formatCharLimit(maxLength)
      : null;
  const mergedHint = [hint, limitHint].filter(Boolean).join(" · ");

  return (
    <label className="block space-y-1.5 text-sm">
      {label ? (
        <span className="flex items-baseline justify-between gap-2 font-medium text-[var(--brand-text)]">
          <span>{label}</span>
          {showCount && typeof maxLength === "number" ? (
            <span className="font-normal text-xs text-[var(--brand-muted)]">
              {current.length.toLocaleString("vi-VN")}/
              {maxLength.toLocaleString("vi-VN")}
            </span>
          ) : null}
        </span>
      ) : null}
      <textarea
        id={inputId}
        maxLength={maxLength}
        className={cn(
          "w-full rounded-[var(--radius)] border border-slate-200 bg-white px-3 py-2 text-[var(--brand-text)] outline-none ring-[var(--brand-primary)] focus:ring-2",
          error && "border-red-500",
          className,
        )}
        {...props}
        value={isControlled ? value : undefined}
        defaultValue={isControlled ? undefined : defaultValue}
        onChange={(e) => {
          if (!isControlled) setInner(e.target.value);
          onChange?.(e);
        }}
      />
      {error ? <span className="text-xs text-red-600">{error}</span> : null}
      {!error && mergedHint ? (
        <span className="block text-xs text-[var(--brand-muted)]">{mergedHint}</span>
      ) : null}
    </label>
  );
}
