export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-[var(--radius)] bg-slate-200 ${className}`}
    />
  );
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-[var(--radius)] border border-dashed border-slate-200 bg-white px-6 py-16 text-center">
      <h3 className="text-lg font-semibold text-[var(--brand-text)]">{title}</h3>
      {description ? (
        <p className="max-w-md text-sm text-[var(--brand-muted)]">{description}</p>
      ) : null}
      {action}
    </div>
  );
}
