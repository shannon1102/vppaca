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
  showRequiredMark?: boolean;
  labelClassName?: string;
};

export function Textarea({
  label,
  error,
  hint,
  showLimit = true,
  showCount = true,
  showRequiredMark = false,
  labelClassName,
  className,
  id,
  maxLength,
  defaultValue,
  value,
  onChange,
  required,
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
    <label className={cn("block text-sm", labelClassName ?? "space-y-1.5")}>
      {label ? (
        <span className="flex items-baseline justify-between gap-2 font-medium text-[var(--brand-text)]">
          <span>
            {label}
            {showRequiredMark && required ? (
              <span className="text-red-600" aria-hidden="true">
                {" "}
                *
              </span>
            ) : null}
          </span>
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
        required={required}
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
