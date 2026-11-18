export function ShelfSkeleton({ title }: { title: string }) {
  return (
    <section className="mb-8 sm:mb-12">
      <h2 className="mb-3 text-base font-bold tracking-tight text-white sm:mb-5 sm:text-[22px] sm:leading-7.5">
        {title}
      </h2>
      <div className="no-scrollbar -mx-4 flex animate-pulse gap-3 overflow-hidden px-4 md:-mx-8 md:px-8 lg:mx-0 lg:grid lg:grid-cols-5 lg:gap-5 lg:px-0">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="w-36 shrink-0 rounded-2xl border border-white/8 bg-surface p-2.5 sm:w-40 lg:w-auto lg:p-3.5"
          >
            <div className="mb-2 aspect-square w-full rounded-xl bg-[#1B2421] lg:mb-3.5" />
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
      <div className="mb-6 grid grid-cols-2 gap-2.5 sm:mb-10 sm:gap-4 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className={`h-12 rounded-lg border border-white/8 bg-surface sm:h-16 ${
              i >= 6 ? "hidden sm:block" : ""
            }`}
          />
        ))}
      </div>
      <div className="mb-8 h-52 rounded-3xl border border-white/8 bg-surface sm:mb-12 lg:h-75" />
    </div>
  );
}
