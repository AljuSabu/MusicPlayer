export default function ListSkeleton() {
  return (
    <div className="animate-pulse space-y-1.5 sm:space-y-2">
      <div className="mb-5 h-8 w-40 rounded bg-surface sm:mb-6 sm:h-9 sm:w-64" />
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="flex min-h-16 items-center gap-3 rounded-xl bg-white/5 py-1.5 pl-2 pr-1 sm:gap-4 sm:p-3"
        >
          <div className="h-12 w-12 shrink-0 rounded-lg bg-[#1B2421] sm:h-16 sm:w-16" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-1/2 rounded bg-[#1B2421]" />
            <div className="h-3 w-1/3 rounded bg-[#1B2421]" />
          </div>
        </div>
      ))}
    </div>
  );
}
