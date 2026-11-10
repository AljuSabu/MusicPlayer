import Link from "next/link";
import { filterTabs, type SearchFilter } from "@/lib/search-filters";

export default function FilterChips({
  query,
  active,
}: {
  query: string;
  active: SearchFilter;
}) {
  const base = `/search?q=${encodeURIComponent(query)}`;

  return (
    <nav
      aria-label="Filter search results"
      className="mb-8 flex items-center gap-2 overflow-x-auto pb-1"
    >
      {filterTabs.map((tab) => {
        const isActive = tab.id === active;
        return (
          <Link
            key={tab.id}
            href={tab.id === "all" ? base : `${base}&type=${tab.id}`}
            prefetch={false}
            replace
            scroll={false}
            aria-current={isActive ? "page" : undefined}
            className={`shrink-0 rounded-full px-5 py-2 text-xs font-semibold transition-[background-color,color,transform] active:scale-95 ${
              isActive
                ? "brand-gradient font-bold text-[#0B0F0E] shadow-[0_0_12px_rgba(76,217,100,0.3)]"
                : "border border-white/8 bg-surface text-[#A3B1AC] hover:bg-[#1B2421] hover:text-white"
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
