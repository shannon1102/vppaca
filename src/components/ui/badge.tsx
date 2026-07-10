export function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full bg-[var(--brand-accent)]/15 px-2.5 py-0.5 text-xs font-semibold text-[var(--brand-secondary)]">
      {children}
    </span>
  );
}
