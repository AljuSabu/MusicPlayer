export default function LibrarySkeleton() {
  return (
    <div className="animate-pulse space-y-5 sm:space-y-8">
      <div className="h-8 w-48 rounded bg-surface sm:h-10 sm:w-64" />
      <div className="space-y-2 sm:space-y-0">
        <div className="h-11 rounded-full bg-surface/50 sm:h-14 sm:rounded-2xl" />
        <div className="flex justify-between sm:hidden">
          <div className="h-11 w-36 rounded-full bg-surface/50" />
          <div className="h-11 w-24 rounded-full bg-surface/50" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
        <div className="col-span-2 h-36 rounded-[20px] bg-surface sm:h-44" />
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-44 rounded-2xl border border-white/6 bg-surface sm:h-48"
          />
        ))}
      </div>
    </div>
  );
}
