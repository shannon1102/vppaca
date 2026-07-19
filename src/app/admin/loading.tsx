export default function AdminLoading() {
  return (
    <div className="animate-pulse space-y-4" aria-busy="true" aria-label="Đang tải">
      <div className="h-1 w-full overflow-hidden rounded-full bg-emerald-100">
        <div className="h-full w-2/5 animate-[admin-indeterminate_1.1s_ease-in-out_infinite] rounded-full bg-[var(--brand-primary)]/70" />
      </div>
      <div className="h-8 w-48 rounded bg-slate-200" />
      <div className="h-32 rounded-[var(--radius)] bg-slate-200" />
      <div className="h-32 rounded-[var(--radius)] bg-slate-200" />
    </div>
  );
}
