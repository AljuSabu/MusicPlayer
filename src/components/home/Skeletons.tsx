export function ShelfSkeleton({ title }: { title: string }) {
  return (
    <section className="mb-12">
      <h2 className="mb-5 text-[22px] font-bold leading-7.5 tracking-tight text-white">
        {title}
      </h2>
      <div className="grid animate-pulse grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 md:grid-cols-4 lg:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border border-white/8 bg-surface p-3.5"
          >
            <div className="mb-3.5 aspect-square w-full rounded-[14px] bg-[#1B2421]" />
            <div className="mb-2 h-3.5 w-3/4 rounded bg-[#1B2421]" />
            <div className="h-3 w-1/2 rounded bg-[#1B2421]" />
          </div>
        ))}
      </div>
    </section>
  );
}

export function FeaturedSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="mb-10 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="h-16 rounded-lg border border-white/8 bg-surface"
          />
        ))}
      </div>
      <div className="mb-12 h-75 rounded-3xl border border-white/8 bg-surface" />
    </div>
  );
}
