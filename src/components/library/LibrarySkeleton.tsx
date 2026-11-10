export default function LibrarySkeleton() {
  return (
    <div className="animate-pulse space-y-8">
      <div className="h-10 w-64 rounded bg-surface" />
      <div className="h-14 rounded-2xl bg-surface/50" />
      <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        <div className="col-span-2 h-44 rounded-[20px] bg-surface" />
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-48 rounded-2xl border border-white/6 bg-surface"
          />
        ))}
      </div>
    </div>
  );
}
