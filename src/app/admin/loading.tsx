export default function AdminLoading() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-8 w-48 rounded bg-slate-200" />
      <div className="h-32 rounded-[var(--radius)] bg-slate-200" />
      <div className="h-32 rounded-[var(--radius)] bg-slate-200" />
    </div>
  );
}
