export default function ShopLoading() {
  return (
    <div className="mx-auto max-w-6xl animate-pulse px-4 py-10">
      <div className="h-8 w-48 rounded bg-slate-200" />
      <div className="mt-4 h-4 w-72 rounded bg-slate-100" />
      <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="overflow-hidden rounded-[var(--radius)] border border-slate-200 bg-white">
            <div className="aspect-square bg-slate-100" />
            <div className="space-y-2 p-3">
              <div className="h-4 rounded bg-slate-100" />
              <div className="h-4 w-2/3 rounded bg-slate-100" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
