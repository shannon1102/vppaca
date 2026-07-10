import { cn } from "@/lib/cn";

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
};

export function Input({ label, error, className, id, ...props }: Props) {
  const inputId = id ?? props.name;
  return (
    <label className="block space-y-1.5 text-sm">
      {label ? (
        <span className="font-medium text-[var(--brand-text)]">{label}</span>
      ) : null}
      <input
        id={inputId}
        className={cn(
          "min-h-11 w-full rounded-[var(--radius)] border border-slate-200 bg-white px-3 text-[var(--brand-text)] outline-none ring-[var(--brand-primary)] focus:ring-2",
          error && "border-red-500",
          className,
        )}
        {...props}
      />
      {error ? <span className="text-xs text-red-600">{error}</span> : null}
    </label>
  );
}
