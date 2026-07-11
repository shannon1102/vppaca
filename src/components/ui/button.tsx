import { cn } from "@/lib/cn";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
};

export function Button({
  className,
  variant = "primary",
  ...props
}: Props) {
  const base =
    "inline-flex min-h-11 items-center justify-center gap-2 rounded-[var(--radius)] px-4 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50";
  const variants = {
    primary:
      "bg-[var(--brand-primary)] text-white hover:bg-[var(--brand-primary-hover)] focus-visible:outline-[var(--brand-primary)]",
    secondary:
      "bg-[var(--brand-secondary)] text-white hover:brightness-110 focus-visible:outline-[var(--brand-secondary)]",
    ghost:
      "bg-transparent text-[var(--brand-text)] hover:bg-black/5 focus-visible:outline-[var(--brand-primary)]",
  };
  return (
    <button className={cn(base, variants[variant], className)} {...props} />
  );
}
