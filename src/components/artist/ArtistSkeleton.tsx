export default function ArtistSkeleton() {
  return (
    <div className="animate-pulse space-y-12">
      <div className="min-h-85 rounded-3xl border border-white/8 bg-surface sm:min-h-95" />
      <div className="space-y-3">
        <div className="h-7 w-32 rounded bg-surface" />
        <div className="space-y-1 rounded-[20px] border border-white/6 bg-surface/60 p-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-14 rounded-xl bg-surface" />
          ))}
        </div>
      </div>
    </div>
  );
}
