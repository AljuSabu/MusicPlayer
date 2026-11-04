export default function ListSkeleton() {
  return (
    <div className="animate-pulse space-y-2">
      <div className="mb-6 h-9 w-64 rounded bg-surface" />
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-4 rounded-xl bg-white/5 p-3"
        >
          <div className="h-16 w-16 rounded-lg bg-[#1B2421]" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-1/2 rounded bg-[#1B2421]" />
            <div className="h-3 w-1/3 rounded bg-[#1B2421]" />
          </div>
        </div>
      ))}
    </div>
  );
}
