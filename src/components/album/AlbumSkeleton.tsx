export default function AlbumSkeleton() {
  return (
    <div className="animate-pulse space-y-6 md:space-y-10">
      <div className="flex flex-col items-center gap-4 pt-1 sm:gap-8 sm:pt-4 md:flex-row md:items-end">
        <div className="h-48 w-48 shrink-0 rounded-[20px] bg-surface sm:h-60 sm:w-60" />
        <div className="flex w-full flex-1 flex-col items-center space-y-3 md:items-start">
          <div className="h-5 w-20 rounded-full bg-surface" />
          <div className="h-7 w-3/4 rounded bg-surface sm:h-12" />
          <div className="h-4 w-1/2 rounded bg-surface" />
        </div>
      </div>
      <div className="h-14 md:h-18 md:border-y md:border-white/8" />
      <div className="space-y-1">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-12 rounded-xl bg-surface/50 sm:h-15" />
        ))}
      </div>
    </div>
  );
}
