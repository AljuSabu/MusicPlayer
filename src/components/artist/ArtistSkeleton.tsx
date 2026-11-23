export default function ArtistSkeleton() {
  return (
    <div className="animate-pulse space-y-8 md:space-y-12">
      <div className="min-h-72 rounded-3xl border border-white/8 bg-surface sm:min-h-95" />
      <div className="space-y-3">
        <div className="h-6 w-28 rounded bg-surface sm:h-7 sm:w-32" />
        <div className="space-y-1 rounded-[20px] border border-white/6 bg-surface/60 p-1.5 sm:p-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-12 rounded-xl bg-surface sm:h-14" />
          ))}
        </div>
      </div>
    </div>
  );
}
