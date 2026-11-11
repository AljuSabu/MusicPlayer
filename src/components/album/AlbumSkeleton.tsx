export default function AlbumSkeleton() {
  return (
    <div className="animate-pulse space-y-10">
      <div className="flex flex-col items-center gap-6 pt-4 sm:gap-8 md:flex-row md:items-end">
        <div className="h-56 w-56 shrink-0 rounded-[20px] bg-surface sm:h-60 sm:w-60" />
        <div className="w-full flex-1 space-y-3">
          <div className="h-6 w-24 rounded-full bg-surface" />
          <div className="h-12 w-3/4 rounded bg-surface" />
          <div className="h-4 w-1/2 rounded bg-surface" />
        </div>
      </div>
      <div className="h-18 border-y border-white/8" />
      <div className="space-y-1">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-15 rounded-xl bg-surface/50" />
        ))}
      </div>
    </div>
  );
}
