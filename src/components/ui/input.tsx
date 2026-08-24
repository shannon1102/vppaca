import { cn } from "@/lib/cn";
import { formatCharLimit } from "@/lib/form-limits";

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
  /** Extra hint under the field (limits, examples). */
  hint?: string;
  /** When true and maxLength is set, show “Tối đa N ký tự”. */
  showLimit?: boolean;
  /** Red asterisk after label when `required` is set. */
  showRequiredMark?: boolean;
  /** Wrapper classes (e.g. gap between label and input). */
  labelClassName?: string;
};

export function Input({
  label,
  error,
  hint,
  showLimit = true,
  showRequiredMark = false,
  labelClassName,
  className,
  id,
  maxLength,
  required,
  ...props
}: Props) {
  const inputId = id ?? props.name;
  const limitHint =
    showLimit && typeof maxLength === "number"
      ? formatCharLimit(maxLength)
      : null;
  const mergedHint = [hint, limitHint].filter(Boolean).join(" · ");

  return (
    <label className={cn("block text-sm", labelClassName ?? "space-y-1.5")}>
      {label ? (
        <span className="font-medium text-[var(--brand-text)]">
          {label}
          {showRequiredMark && required ? (
            <span className="text-red-600" aria-hidden="true">
              {" "}
              *
            </span>
          ) : null}
        </span>
      ) : null}
      <input
        id={inputId}
        className={cn(
          "min-h-11 w-full rounded-[var(--radius)] border border-slate-200 bg-white px-3 text-[var(--brand-text)] outline-none ring-[var(--brand-primary)] focus:ring-2",
          error && "border-red-500",
          className,
        )}
        {...props}
        required={required}
        maxLength={maxLength}
      />
      {error ? <span className="text-xs text-red-600">{error}</span> : null}
      {!error && mergedHint ? (
        <span className="block text-xs text-[var(--brand-muted)]">{mergedHint}</span>
      ) : null}
    </label>
  );
}
