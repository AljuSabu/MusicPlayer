"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Clock, Search, X } from "lucide-react";
import {
  getRecentSearches,
  removeRecentSearch,
  clearRecentSearches,
} from "@/lib/recent-searches";

export default function RecentSearches() {
  const [terms, setTerms] = useState<string[]>([]);

  // Read after mount so server and client HTML match
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTerms(getRecentSearches());
  }, []);

  if (terms.length === 0) return null;

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-[#4CD964]" />
          <h2 className="text-lg font-bold text-white">Recent searches</h2>
        </div>
        <button
          onClick={() => {
            clearRecentSearches();
            setTerms([]);
          }}
          className="text-xs font-medium text-[#6B7A75] transition-colors hover:text-error"
        >
          Clear all
        </button>
      </div>

      <div className="flex flex-wrap gap-2.5 pt-1">
        {terms.map((term) => (
          <div
            key={term}
            className="group inline-flex items-center rounded-full border border-white/8 bg-surface transition-colors hover:border-[#4CD964]/40 hover:bg-[#1B2421]"
          >
            <Link
              href={`/search?q=${encodeURIComponent(term)}`}
              prefetch={false}
              className="inline-flex items-center gap-2 py-2 pl-4 pr-2 text-xs font-medium text-[#A3B1AC] hover:text-white"
            >
              <Search className="h-3.5 w-3.5 text-[#6B7A75] transition-colors group-hover:text-[#4CD964]" />
              <span>{term}</span>
            </Link>
            <button
              onClick={() => setTerms(removeRecentSearch(term))}
              aria-label={`Remove ${term} from recent searches`}
              className="mr-2 rounded-full p-0.5 text-[#6B7A75] transition-colors hover:bg-white/10 hover:text-white"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
