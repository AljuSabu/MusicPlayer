export function SongsSkeleton() {
  return (
    <div className="grid animate-pulse grid-cols-1 gap-6 lg:grid-cols-12">
      <div className="h-72 rounded-3xl border border-white/8 bg-surface lg:col-span-5" />
      <div className="space-y-1.5 lg:col-span-7">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-17 rounded-xl bg-surface/60" />
        ))}
      </div>
    </div>
  );
}
